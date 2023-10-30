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

        if (registerBody.full_name.length == 0) {
            return res.json({
                success: true,
                mensaje: 'name incorrect, The name must have at least one letter, try again'
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

    try {
        const email = req.body.email;
        const password = req.body.password;

        const loginByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if (loginByEmail?.is_active !== true) {
            return res.json({
                success: true,
                message: "this user not exist"
            })
        }

        if (!loginByEmail) {
            return res.json({
                success: true,
                message: "user or password incorrect"
            })
        }

        if (!bcrypt.compareSync(password, loginByEmail.password)) {
            return res.json({
                success: true,
                message: "user or password incorrect"
            })
        }

        const roleName = loginByEmail.role.role_name;
        const secret = process.env.JWT_SECRET as string

        const token = jwt.sign({
            id: loginByEmail.id,
            email: loginByEmail.email,
            role: roleName
        }, secret, {
            expiresIn: "5h"
        })


        return res.json({
            success: true,
            message: "user logged succesfully",
            token: token
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "user can't by logged",
            error
        })
    }
}

const profile = async (req: Request, res: Response) => {

    try {
        const email = req.token.email
        const profileUser = await User.findOneBy({
            email
        })

        return res.json({
            success: true,
            message: "profile user retrieved",
            data: {
                full_name: profileUser?.full_name,
                email: profileUser?.email,
                phone_number: profileUser?.phone_number
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "user profile can't be retrieved",
            error
        })
    }
}

const updateUser = async (req: Request, res: Response) => {

    try {
        const bodyUser = req.body
        const id = req.token.id

        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;

        if (typeof (bodyUser.full_name) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Name is incorrect; only strings are allowed. Please try again.'
            });
        }

        if (bodyUser.full_name.length > 50) {
            return res.json({
                success: true,
                mensaje: 'Name is too long. Please insert a shorter name (maximum 50 characters).'
            });
        }

        if (typeof (bodyUser.password) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Password is incorrect; only strings are allowed. Please try again'
            });
        }

        if (bodyUser.password.length > 100) {
            return res.json({
                success: true,
                mensaje: 'Password is too long. Please insert a shorter password (maximum 100 characters).'
            });
        }

        if (!passwordRegex.test(req.body.password)) {
            return res.json({
                success: true,
                mensaje: 'Password is incorrect. Please try again'
            });
        }

        if (typeof (bodyUser.phone_number) !== "number") {
            return res.json({
                success: true,
                mensaje: 'Phone number is incorrect; only numbers are allowed. Please try again'
            });
        }

        if (bodyUser.phone_number.length > 20) {
            return res.json({
                success: true,
                mensaje: 'Phone number is too long. Please insert a shorter number (maximum 20 characters).'
            });
        }

        const encrytedPassword = await bcrypt.hash(bodyUser.password, 10)

        const updateOneUser = await User.update({
            id
        }, {
            full_name: bodyUser.full_name,
            password: encrytedPassword,
            phone_number: bodyUser.phone_number
        })

        return res.json({
            success: true,
            message: "User updated successfully.",
            data: {
                full_name: bodyUser.full_name,
                phone_number: bodyUser.phone_number
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "User can't be registered, please try again.",
            error
        })
    }
}

const getAllUsers = async (req: Request, res: Response) => {

    try {
        // en la url:
        // ?skip=3         me trae por pagina 3 usuarios
        // &page=2         trae la pagina 2
        // urlcompleta?skip=3&page=2 

        if (typeof (req.query.skip) !== "string") {
            return res.json({
                success: true,
                message: "skip it's not string."
            })
        }

        if (typeof (req.query.page) !== "string") {
            return res.json({
                success: true,
                message: "page it's not string."
            })
        }

        const pageSize = parseInt(req.query.skip as string) || 5
        const page: any = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * pageSize

        const users = await User.find({
            skip: skip,
            take: pageSize
        })

        if (users.length == 0) {
            return res.json({
                success: true,
                message: "There are no registered users."
            })
        }

        const transformedUsers = users.map((users) => {
            return {
                id: users.id,
                email: users.email,
                name: users.full_name,
                phone_number: users.phone_number,
                is_active: users.is_active,
                role_id: users.is_active,
                created_at: users.is_active,
                updated_at: users.is_active
            };
        });

        return res.json({
            success: true,
            message: "Here you can see all the users.",
            data: transformedUsers
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Unable to display the users.",
            error
        })
    }
}

const getAllWorkers = async (req: Request, res: Response) => {

    try {
        if (typeof (req.query.skip) !== "string") {
            return res.json({
                success: true,
                message: "skip it's not string."
            })
        }

        if (typeof (req.query.page) !== "string") {
            return res.json({
                success: true,
                message: "page it's not string."
            })
        }

        const pageSize = parseInt(req.query.skip as string) || 5
        const page: any = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * pageSize

        const profileUser = await User.find({
            where: {
                role_id: 2
            },
            skip: skip,
            take: pageSize
        });

        if (profileUser.length == 0) {
            return res.json({
                success: false,
                message: "there are not any registered worker",
            })
        }

        const mappingUsers = profileUser.map(users => {
            if (users.is_active == true) {
                return {
                    name: users.full_name,
                    email: users.email,
                    phone_number: users.phone_number,
                };
            }
        });

        return res.json({
            success: true,
            message: "here are all the workers",
            data: mappingUsers
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "the workers can't be retrieved",
            error
        })
    }
}



export { register, login, profile, updateUser, getAllUsers, 
    getAllWorkers} 