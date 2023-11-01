import { Request, Response } from "express-serve-static-core"
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateEmail, validateNumber, validatePassword, validateString } from "../validations/validations";

const register = async (req: Request, res: Response) => {

    try {
        const {full_name, email, password, phone_number} = req.body

        if (validateString(full_name, 50)) {
            return res.json({ success: true, message: validateString(full_name, 50) });
        }

        if (validateEmail(email)) {
            return res.json({ success: true, message: validateEmail(email) });
        }

        if (validatePassword(password)) {
            return res.json({ success: true, message: validatePassword(password) });
        }

        if (validateNumber(phone_number, 12)) {
            return res.json({ success: true, message: validateNumber(phone_number, 12) });
        }

        const encrytedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            full_name,
            email,
            password: encrytedPassword,
            phone_number
        }).save()

        return res.json({
            success: true,
            message: "user registered succesfully",
            data: {
                full_name,
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
        const {email, password} = req.body;

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
        const {full_name, password, phone_number} = req.body
        const id = req.token.id

        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;

        if (typeof (full_name) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Name is incorrect; only strings are allowed. Please try again.'
            });
        }

        if (full_name.length > 50) {
            return res.json({
                success: true,
                mensaje: 'Name is too long. Please insert a shorter name (maximum 50 characters).'
            });
        }

        if (typeof (password) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Password is incorrect; only strings are allowed. Please try again'
            });
        }

        if (password.length > 100) {
            return res.json({
                success: true,
                mensaje: 'Password is too long. Please insert a shorter password (maximum 100 characters).'
            });
        }

        if (!passwordRegex.test(password)) {
            return res.json({
                success: true,
                mensaje: 'Password is incorrect. Please try again'
            });
        }

        if (typeof (phone_number) !== "number") {
            return res.json({
                success: true,
                mensaje: 'Phone number is incorrect; only numbers are allowed. Please try again'
            });
        }

        const encrytedPassword = await bcrypt.hash(password, 10)

        await User.update({
            id
        }, {
            full_name,
            password: encrytedPassword,
            phone_number
        })

        return res.json({
            success: true,
            message: "User updated successfully.",
            data: {
                full_name,
                phone_number
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

        const transformedUsers = users.map((user) => {
            const {password, ...rest} = user
            return { ...rest };
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

const createWorker = async (req: Request, res: Response) => {

    try {
        const {full_name, email, password, phone_number } = req.body;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;

        if (typeof (full_name) !== "string") {
            return res.json({
                success: true,
                mensaje: 'name incorrect, you can put only strings, try again'
            });
        }

        if (full_name.length < 1) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 50 characters'
            });
        }
        if (full_name.length > 50) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 50 characters'
            });
        }

        if (typeof (email) !== "string") {
            return res.json({
                success: true,
                mensaje: 'email incorrect, you can put only strings, try again'
            });
        }

        if (email.length > 100) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 100 characters'
            });
        }

        if (!emailRegex.test(email)) {
            return res.json({
                success: true,
                mensaje: 'email incorrect, try again'
            });
        }

        if (typeof (password) !== "string") {
            return res.json({
                success: true,
                mensaje: 'password incorrect, you can put only strings, try again'
            });
        }

        if (password.length > 100) {
            return res.json({
                success: true,
                mensaje: 'password too long, try to insert a shorter name, max 100 characters'
            });
        }

        if (!passwordRegex.test(password)) {
            return res.json({
                success: true,
                mensaje: 'password incorrect, try again'
            });
        }

        if (typeof (phone_number) !== "number") {
            return res.json({
                success: true,
                mensaje: 'phone_number incorrect, you can put only numbers, try again'
            });
        }

        const encrytedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            full_name,
            email,
            password: encrytedPassword,
            phone_number,
            role_id: 2
        }).save()

        return res.json({
            success: true,
            message: "worker registered succesfully",
            data: {
                full_name: newUser.full_name,
                email: newUser.email,
                phone_number: newUser.phone_number,
                role_id: newUser.role_id
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "worker can't be registered, try again",
            error
        })
    }
}

const deleteUserBySuperAdmin = async (req: Request, res: Response) => {

    try {
        const deleteById = req.body.id

        if (!deleteById) {
            return res.json({
                success: true,
                message: "you must insert one id",
            })
        }

        if (typeof (deleteById) !== "number") {
            return res.json({
                success: true,
                mensaje: "id incorrect, you can put only numbers, try again"
            });
        }

        await User.delete({
            id: deleteById
        })

        return res.json({
            success: true,
            message: "The user was successfully deleted.",
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Unable to delete the user, please try again.",
            error
        })
    }
}

const changeRole = async (req: Request, res: Response) => {

    try {
        const{role_id, user_id} = req.body

        if (!role_id){
            return res.json({
                success: true,
                message: "role_id incorrect."
            })
        }

        if (role_id>3 || role_id<1){
            return res.json({
                success: true,
                message: "role_id incorrect."
            })
        }

        if (!user_id){
            return res.json({
                success: true,
                message: "user_id incorrect."
            })
        }

        const usersId = await User.find()

        const mapUsersId = usersId.map((obj)=>{
            obj.id
        })

        if(!mapUsersId.includes(user_id)){
            return res.json({
                success: true,
                message: "user_id not exist."
            })
        }

        const updateRole = await User.update({
            id:user_id
        },{
            role_id
        })

        return res.json({
            success: true,
            message: "role of the user is updated succesfully",
            data: {
                id:user_id,
                role_id
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Unable to update the user, please try again.",
            error
        })
    }
}

export { register, login, profile, updateUser, getAllUsers, 
    getAllWorkers, createWorker, deleteUserBySuperAdmin, changeRole } 