import { Router } from "express";
import { auth } from "../middleware/auth";
import { createAppointment, deleteAppointment, getAppointmentsByWorker, getAppointmentsUser, 
    updateAppointment, getallAppointments, getAppointmentDetail, appointmentValidation } from "../controllers/appointmentsControllers";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.get('/byUser',auth, getAppointmentsUser)
router.post('/create',auth, createAppointment)
router.put('/update',auth, updateAppointment)
router.delete('/delete',auth, deleteAppointment)
router.get('/byWorker',auth, isAdmin, getAppointmentsByWorker)
router.get('/bySuperAdmin',auth, isSuperAdmin, getallAppointments)
router.get('/detail',auth, getAppointmentDetail)
router.get('/validation', auth, appointmentValidation)

export {router}