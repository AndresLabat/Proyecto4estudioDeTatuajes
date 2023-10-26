import { Request, Response } from "express-serve-static-core"
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {

    try {
        const registerBody = req.body;
        // password: Aa1234@
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;

        if (typeof (registerBody.full_name) !== "string") {
            return res.json({
                success: true,
                mensaje: 'name incorrect, you can put only strings, try again'
            });
        }

        if (registerBody.full_name.length > 50) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 50 characters'
            });
        }

        if (typeof (registerBody.email) !== "string") {
            return res.json({
                success: true,
                mensaje: 'email incorrect, you can put only strings, try again'
            });
        }

        if (registerBody.email.length > 100) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 100 characters'
            });
        }

        if (!emailRegex.test(req.body.email)) {
            return res.json({
                success: true,
                mensaje: 'email incorrect, try again'
            });
        }

        if (typeof (registerBody.password) !== "string") {
            return res.json({
                success: true,
                mensaje: 'password incorrect, you can put only strings, try again'
            });
        }

        if (registerBody.password.length > 100) {
            return res.json({
                success: true,
                mensaje: 'password too long, try to insert a shorter name, max 100 characters'
            });
        }

        if (!passwordRegex.test(req.body.password)) {
            return res.json({
                success: true,
                mensaje: 'password incorrect, try again'
            });
        }

        if (typeof (registerBody.phone_number) !== "number") {
            return res.json({
                success: true,
                mensaje: 'phone_number incorrect, you can put only numbers, try again'
            });
        }

        if (registerBody.phone_number.length > 20) {
            return res.json({
                success: true,
                mensaje: 'phone_number too long, try to insert a shorter name, max 20 characters'
            });
        }

        const encrytedPassword = await bcrypt.hash(registerBody.password, 10)

        const newUser = await User.create({
            full_name: registerBody.full_name,
            email: registerBody.email,
            password: encrytedPassword,
            phone_number: registerBody.phone_number
        }).save()

        return res.json({
            success: true,
            message: "user registered succesfully",
            data: {
                full_name: newUser.full_name,
                email: newUser.email,
                phone_number: newUser.phone_number
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "user can't be registered, try again",
            error
        })
    }
}

const login = async (req: Request, res: Response) => {

}

const profile = async (req: Request, res: Response) => {

}

const updateUser = async (req: Request, res: Response) => {

}

const getAllUsers = async (req: Request, res: Response) => {

}

export { register, login, profile, updateUser, getAllUsers } 