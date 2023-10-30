import { Request, Response } from "express-serve-static-core"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User"

const getAppointmentsUser = async (req: Request, res: Response) => {

    try {
        const id = req.token.id

        const appointmentsUser = await Appointment.findBy({
            client_id: id
        })

        const appointmentsUserForShows = await Promise.all(appointmentsUser.map(async (obj) => {
            const { status, worker_id, client_id, ...rest } = obj;

            const worker = await User.findOneBy({
                id: worker_id
            });

            if (worker) {
                const email = worker.email;
                const is_active = worker.is_active;
                return { ...rest, email, is_active };
            }
            else {
                return null
            }
        }));

        return res.json({
            success: true,
            message: "Here are all your appointments",
            data: appointmentsUserForShows
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments can't be getted, try again",
            error
        })
    }
}

const createAppointment = async (req: Request, res: Response) => {

    try {
        const date = req.body.date
        const time = req.body.time
        const email = req.body.email
        const id = req.token.id

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!email) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
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
                mensaje: 'email format incorrect, try again'
            });
        }

        const loginByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if (loginByEmail?.is_active !== true) {
            return res.json({
                success: true,
                message: "this worker not exist"
            })
        }

        if (loginByEmail?.role.role_name != "admin") {
            return res.json({
                success: true,
                message: "sorry, this user isn't a worker, try again"
            })
        }

        if (id == loginByEmail.id) {
            return res.json({
                success: true,
                message: "sorry, you can't create a appointment with yourself"
            })
        }

        if (!date) {
            return res.json({
                success: true,
                message: "you must insert a date",
            })
        }

        if (typeof (date) !== "string") {
            return res.json({
                success: true,
                mensaje: "date incorrect, you can put only strings, try again"
            });
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(date)) {
            return res.json({
                success: true,
                mensaje: "date incorrect, The date format should be YYYY-MM-DD, try again"
            });
        }

        if (!time) {
            return res.json({
                success: true,
                message: "you must insert a time",
            })
        }

        if (typeof (time) !== "string") {
            return res.json({
                success: true,
                mensaje: "time incorrect, you can put only strings, try again"
            });
        }

        const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

        if (!timeRegex.test(time)) {
            return res.json({
                success: true,
                mensaje: "time incorrect, The time format should be HH:MM:SS, try again"
            });
        }

        // VALIDACIONES DE FECHAS Y HORAS A HACER A TRAVES DE LA LIBRERIA 
        // https://www.npmjs.com/package/dayjs


        // if(createNewAppointment.date ==   && createNewAppointment.time == ){
        //     return res.json({
        //         success: true,
        //         message: "sorry, you can't create a appointment with yourself"
        //     })
        // }

        const createNewAppointment = await Appointment.create({
            date,
            time,
            worker_id: loginByEmail.id,
            client_id: id
        }).save()

        return res.json({
            success: true,
            message: "appointment created succesfully",
            data: {
                date: createNewAppointment.date,
                time: createNewAppointment.time,
                email: email,
                id: createNewAppointment.id,
                created_at: createNewAppointment.created_at,
                updated_at: createNewAppointment.updated_at
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "appointment can't be created, try again",
            error
        })
    }
}

const updateAppointment = async (req: Request, res: Response) => {

    try {
        const client_id = req.token.id
        const { id: appointmentId, date, time, email } = req.body

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!email) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
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
                mensaje: 'email format incorrect, try again'
            });
        }

        const findWorker_id = await User.findOneBy({
            email
        })

        if (findWorker_id?.is_active !== true) {
            return res.json({
                success: true,
                message: "this worker not exist"
            })
        }

        const worker_id = findWorker_id?.id

        if (!appointmentId) {
            return res.json({
                success: true,
                message: "you must insert an id",
            })
        }

        if (typeof (appointmentId) !== "number") {
            return res.json({
                success: true,
                mensaje: "id incorrect, you can put only numbers, try again"
            });
        }

        if (!date) {
            return res.json({
                success: true,
                message: "you must insert a date",
            })
        }

        if (typeof (date) !== "string") {
            return res.json({
                success: true,
                mensaje: "date incorrect, you can put only strings, try again"
            });
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(date)) {
            return res.json({
                success: true,
                mensaje: "date incorrect, The date format should be YYYY-MM-DD, try again"
            });
        }

        if (!time) {
            return res.json({
                success: true,
                message: "you must insert a time",
            })
        }

        if (typeof (time) !== "string") {
            return res.json({
                success: true,
                mensaje: "time incorrect, you can put only strings, try again"
            });
        }

        const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

        if (!timeRegex.test(time)) {
            return res.json({
                success: true,
                mensaje: "time incorrect, The time format should be HH:MM:SS, try again"
            });
        }

        const appointmentsClient = await Appointment.findBy({
            client_id,
        })

        const appointmentsId = await appointmentsClient.map((object) =>
            object.id
        )

        if (!appointmentsId.includes(appointmentId)) {
            return res.json({
                success: true,
                message: "appointment updated not succesfully, incorrect id"
            })
        }

        // VALIDACIONES DE FECHAS Y HORAS A HACER A TRAVES DE LA LIBRERIA 
        // https://www.npmjs.com/package/dayjs


        // if(createNewAppointment.date ==   && createNewAppointment.time == ){
        //     return res.json({
        //         success: true,
        //         message: "sorry, you can't create a appointment with yourself"
        //     })
        // }

        await Appointment.update({
            id: appointmentId
        }, {
            date,
            time,
            worker_id
        })

        const dataAppointmentUpdated = await Appointment.findOneBy({
            id: appointmentId
        })

        return res.json({
            success: true,
            message: "appointment created succesfully",
            data: {
                date,
                time,
                email,
                id: appointmentId,
                created_at: dataAppointmentUpdated?.created_at,
                updated_at: dataAppointmentUpdated?.updated_at
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "appointment can't be updated, try again",
            error
        })
    }
}

const deleteAppointment = async (req: Request, res: Response) => {

    try {
        const deleteById = req.body.id
        const clientId = req.token.id

        if (!deleteById) {
            return res.json({
                success: true,
                message: "you must insert an id",
            })
        }

        if (typeof (deleteById) !== "number") {
            return res.json({
                success: true,
                mensaje: "id incorrect, you can put only numbers, try again"
            });
        }

        const getUser = await Appointment.findBy({
            client_id: clientId
        })

        const appointments_id = getUser.map((appointment) =>
            appointment.id
        )

        if (!appointments_id.includes(deleteById)) {
            return res.json("no se puede borrar")
        }

        const deleteAppointmentById = await Appointment.delete({
            id: deleteById
        })

        return res.json({
            success: true,
            message: "appointment deleted succesfully",
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "appointment can't be deleted, try again",
            error
        })
    }
}

export { getAppointmentsUser, createAppointment, updateAppointment, deleteAppointment }