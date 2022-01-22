
import express, { Request, Response } from 'express';
import { collections } from './../services/database.service';
import User from './../models/users';
import jwt from 'jsonwebtoken';

export const sessionController = express.Router();

sessionController.post("/", async (req: Request, res: Response) => {
    const email = req?.body?.email;
    const password = req?.body?.password;

    if (!email || !password) {
        return res.status(401).send("Expected email and password fields");
    }

    try {
        const userJson = (await collections.users.findOne({ email })) as unknown as User;

        const user = new User(userJson.name, userJson.email, userJson.password, userJson._id);

        if (!user) {
            return res.status(401).send("User not found");
        }


        if (!(await user.checkPassword(password))) {
            return res.status(401).send("Invalid password");
        }

        user.password = undefined;


        res.status(200).json({
            user,
            token: user.generateToken(),
        });
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }

});