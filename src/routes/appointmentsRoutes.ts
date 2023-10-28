import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment, deleteAppointment, getAppointment, updateAppointment } from "../controllers/appointmentsControllers";

const router = Router();

router.get('/',auth, getAppointment)
router.post('/',auth, createAppointment)
router.put('/',auth, updateAppointment)
router.delete('/',auth, deleteAppointment)

export {router}