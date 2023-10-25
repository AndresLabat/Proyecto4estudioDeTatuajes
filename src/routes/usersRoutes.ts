import { Router } from "express";
import { register, login, profile, updateUser, getAllUsers } from "../controllers/usersControllers";

const router = Router();

router.post('/register', register)
router.post('/login', login)
router.get('/profile', profile)
router.put('/update', updateUser)

router.get('/all', getAllUsers)

export {router}