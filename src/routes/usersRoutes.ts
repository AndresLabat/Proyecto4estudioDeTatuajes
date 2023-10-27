import { Router } from "express";
import { register, login, profile, updateUser, getAllUsers } from "../controllers/usersControllers";
import { auth } from "../middleware/auth";

const router = Router();

router.post('/register', register)
router.post('/login', login)
router.get('/profile', auth, profile)
router.put('/update', auth, updateUser)

router.get('/all', getAllUsers)

export {router}