import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment, deleteAppointment, getAppointmentsByWorker, getAppointmentsUser, 
    updateAppointment} from "../controllers/appointmentsControllers";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.get('/byUser',auth, getAppointmentsUser)
router.post('/create',auth, createAppointment)
router.put('/update',auth, updateAppointment)
router.delete('/delete',auth, deleteAppointment)
router.get('/byWorker',auth, isAdmin, getAppointmentsByWorker)


export {router}