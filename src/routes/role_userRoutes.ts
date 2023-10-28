import { Router } from "express";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

const router = Router();

router.get('/all',auth ,isSuperAdmin)

export {router}