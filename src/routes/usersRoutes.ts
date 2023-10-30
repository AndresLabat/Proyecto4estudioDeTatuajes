import { Router } from "express";
import { register, login, profile, updateUser, getAllUsers, getAllWorkers} from "../controllers/usersControllers";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

const router = Router();

router.post('/register', register)
router.post('/login', login)
router.get('/profile', auth, profile)
router.put('/update', auth, updateUser)
router.get('/all',auth ,isSuperAdmin ,getAllUsers)
router.get('/allWorkers', auth, getAllWorkers)


export {router}