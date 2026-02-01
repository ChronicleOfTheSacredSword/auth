import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from '../src/domain/user';
import { UserRepo } from './adapters/driven/userRepo';
import { UserService } from './services/userService';
import { UserController } from './adapters/driving/userController';
import authenticateToken from './authJWToken';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  	throw new Error("Missing JWT secrets in environment variables");
}

const repo_user = new UserRepo();
const user_service = new UserService(repo_user);
const user_controller = new UserController(user_service);

let refreshTokens: string[] = [];

function generateAccessToken(user: any): string {
  	return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

app.post("/token", (req: Request, res: Response) => {
	const refreshToken: string | undefined = req.body.token;

	if (!refreshToken) return res.sendStatus(401);
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

	jwt.verify(
		refreshToken,
		REFRESH_TOKEN_SECRET,
		(err: any, decoded: any) => {
			if (err || !decoded) return res.sendStatus(403);

			const user = decoded as JwtPayload;
			const accessToken = generateAccessToken({ name: user.name });

			res.json({ accessToken });
		}
	);
});

app.get('/tests', authenticateToken, (req, res) => {
  	res.json({message: "caca"})
});

app.delete("/logout", (req: Request, res: Response) => {
	const refreshToken: string | undefined = req.body.token;
	refreshTokens = refreshTokens.filter(token => token !== refreshToken);
	res.sendStatus(204);
});

app.post("/login", async (req: Request, res: Response) => {
	const user: User = req.body;
	
	if(!user.name || !user.password ){
		res.sendStatus(400);
	}

	const auth = await user_controller.authUser(user);

	if(auth){
		const accessToken = generateAccessToken({ name: user.name });
		const refreshToken = jwt.sign(user.name, REFRESH_TOKEN_SECRET);

		refreshTokens.push(refreshToken);

		res.json({accessToken, refreshToken});
	}
	else{
		res.sendStatus(403);
	}
});

app.listen(PORT, () => {
  	console.log(`Auth server running on http://localhost:${PORT}`);
});
