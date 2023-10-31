import { Request, Response } from "express-serve-static-core"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User"
import { Portfolio } from "../models/Portfolio"
import { Appointment_portfolio } from "../models/Appointment_portfolio"

const getAppointmentsUser = async (req: Request, res: Response) => {

    try {
        const id = req.token.id

        const appointmentsUser = await Appointment.find({
            where: {
                client_id: id
            },
            relations: ["appointmentPortfolios"]
        })

        const appointmentsUserForShows = await Promise.all(appointmentsUser.map(async (obj) => {
            const { status, worker_id, client_id, appointmentPortfolios, ...rest } = obj;
            const nameProduct = obj.appointmentPortfolios.map((obj) => obj.name)

            const worker = await User.findOneBy({
                id: worker_id
            });

            if (worker) {
                const full_name = worker.full_name
                const email = worker.email;
                const is_active = worker.is_active;
                const name = nameProduct[0]
                return { full_name, email, name, is_active, ...rest };
            }
            else {
                return null
            }
        }));

        if (appointmentsUserForShows.length == 0) {
            return res.json({
                success: true,
                message: "This user has not appointments",
            });
        }

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
        const shift = req.body.shift
        const email = req.body.email
        const purchase_Name = req.body.name
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

        if (email.length == 0) {
            return res.json({
                success: true,
                mensaje: 'email too short, try to insert a larger name, max 100 characters'
            });
        }

        if (email.length > 100) {
            return res.json({
                success: true,
                mensaje: 'email too long, try to insert a shorter name, max 100 characters'
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

        if (!shift) {
            return res.json({
                success: true,
                message: "you must insert a shift",
            })
        }

        if (typeof (shift) !== "string") {
            return res.json({
                success: true,
                mensaje: "shift incorrect, you can put only strings, try again"
            });
        }

        if (shift !== "morning" && shift !== "afternoon") {
            return res.json({
                success: true,
                mensaje: "shift incorrect, you only can put morning or afternoon, try again"
            });
        }

        if (!purchase_Name) {
            return res.json({
                success: true,
                message: "you must insert an name",
            })
        }

        if (typeof (purchase_Name) !== "string") {
            return res.json({
                success: true,
                mensaje: 'name incorrect, you can put only strings, try again'
            });
        }

        if (purchase_Name.length == 0) {
            return res.json({
                success: true,
                mensaje: 'name too short, try to insert a larger name, max 100 characters'
            });
        }

        if (purchase_Name.length > 100) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 100 characters'
            });
        }

        const getPurchaseItems = await Portfolio.find()
        const mapPortfolio = getPurchaseItems.map((obj) => obj.name)

        if (!mapPortfolio.includes(purchase_Name)) {
            return res.json({
                success: true,
                message: "the name of the item purchase doesn't exist",
            })
        }

        // VALIDACIONES DE FECHAS Y TURNOS A HACER A TRAVES DE LA LIBRERIA 
        //
        //
        //
        //
        //
        //
        // VALIDACIONES DE FECHAS Y TURNOS A HACER A TRAVES DE LA LIBRERIA 

        const createNewAppointment = await Appointment.create({
            date,
            shift,
            worker_id: loginByEmail.id,
            client_id: id
        }).save()

        const getPortfolio = await Portfolio.findOneBy({
            name: purchase_Name
        })

        const createAppointment = await Appointment_portfolio.create({
            appointment_id: createNewAppointment.id,
            portfolio_id: getPortfolio?.id
        }).save()

        return res.json({
            success: true,
            message: "appointment created succesfully",
            data: {
                date: createNewAppointment.date,
                shift: createNewAppointment.shift,
                email: email,
                id: createNewAppointment.id,
                purchase_Name: getPortfolio?.name,
                price: getPortfolio?.price,
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
        const { id, date, shift, email, name } = req.body
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

        if (!id) {
            return res.json({
                success: true,
                message: "you must insert an id",
            })
        }

        if (typeof (id) !== "number") {
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

        if (!shift) {
            return res.json({
                success: true,
                message: "you must insert a shift",
            })
        }

        if (typeof (shift) !== "string") {
            return res.json({
                success: true,
                mensaje: "shift incorrect, you can put only strings, try again"
            });
        }

        if (shift !== "morning" && shift !== "afternoon") {
            return res.json({
                success: true,
                mensaje: "shift incorrect, you only can put morning or afternoon, try again"
            });
        }

        const appointmentsClient = await Appointment.findBy({
            client_id,
        })

        const appointmentsId = await appointmentsClient.map((object) =>
            object.id
        )

        if (!appointmentsId.includes(id)) {
            return res.json({
                success: true,
                message: "appointment updated not succesfully, incorrect id"
            })
        }

        if (!name) {
            return res.json({
                success: true,
                message: "you must insert an name",
            })
        }

        if (typeof (name) !== "string") {
            return res.json({
                success: true,
                mensaje: 'name incorrect, you can put only strings, try again'
            });
        }

        if (name.length == 0) {
            return res.json({
                success: true,
                mensaje: 'name too short, try to insert a larger name, max 100 characters'
            });
        }

        if (name.length > 100) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 100 characters'
            });
        }

        const getPurchaseItems = await Portfolio.find()
        const mapPortfolio = getPurchaseItems.map((obj) => obj.name)

        if (!mapPortfolio.includes(name)) {
            return res.json({
                success: true,
                message: "the name of the item purchase doesn't exist",
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
            id: id
        }, {
            date,
            shift,
            worker_id
        })

        const dataAppointmentUpdated = await Appointment.findOneBy({
            id: id
        })

        return res.json({
            success: true,
            message: "appointment created succesfully",
            data: {
                date,
                shift,
                email,
                id: id,
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

const getAppointmentsByWorker = async (req: Request, res: Response) => {

    try {
        const id = req.token.id

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

        const appointmentsWorker = await Appointment.find({
            where: { worker_id: id },
            skip: skip,
            take: pageSize
        })

        const appointmentsWorkerForShows = await Promise.all(appointmentsWorker
            .filter((obj) => obj.status === false)
            .map(async (obj) => {
                const { worker_id, client_id, ...rest } = obj;
                const client = await User.findOneBy({
                    id: client_id
                });
                if (client) {
                    const client_name = client.full_name
                    const client_email = client.email;
                    const is_active = client.is_active;
                    return { client_name, client_email, is_active, ...rest };
                }
                else {
                    return null
                }
            })
        );

        if (appointmentsWorkerForShows.length == 0) {
            return res.json({
                success: true,
                message: "This worker has no appointments",
            });
        }

        return res.json({
            success: true,
            message: "Here are all your appointments as worker",
            data: appointmentsWorkerForShows
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "worker appointments can't be getted, try again",
            error
        })
    }
}

const getallAppointments = async (req: Request, res: Response) => {

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

        const appointmentsUser = await Appointment.find({
            skip: skip,
            take: pageSize
        })

        const appointmentsUserForShows = await Promise.all(appointmentsUser.map(async (obj) => {
            const { worker_id, client_id, ...rest } = obj;

            const clientInfo = await User.findOneBy({
                id: client_id
            });

            const workerInfo = await User.findOneBy({
                id: worker_id
            });

            if (clientInfo && workerInfo) {
                const client_email = clientInfo.email;
                const client_name = clientInfo.full_name;
                const client_is_active = clientInfo.is_active;
                const worker_email = workerInfo.email;
                const worker_name = workerInfo.full_name;
                const worker_is_active = workerInfo.is_active;

                return { ...rest, client_is_active, client_email, client_name, worker_email, worker_name, worker_is_active };
            }
            else {
                return null
            }
        }));

        if (appointmentsUserForShows.length == 0) {
            return res.json({
                success: true,
                message: "This bussiness has no appointments",
            });
        }

        return res.json({
            success: true,
            message: "Here are all the appointments",
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

const getAppointmentDetail = async (req: Request, res: Response) => {

    try {
        const appointment_id = req.body.id
        const id = req.token.id

        const appointmentsUser = await Appointment.find({
            where: {
                client_id: id
            },
            relations: ["appointmentPortfolios"]
        })

        const appointmentsUserForShow = await Promise.all(appointmentsUser.map(async (obj) => {
            const { status, worker_id, client_id, appointmentPortfolios, ...rest } = obj;
            const nameProduct = obj.appointmentPortfolios.map((obj) => obj.name)

            const worker = await User.findOneBy({
                id: worker_id
            });

            if (worker) {
                const full_name = worker.full_name
                const email = worker.email;
                const is_active = worker.is_active;
                const name = nameProduct[0]
                return { full_name, email, name, is_active, ...rest };
            }
            else {
                return null
            }
        }));

        if (appointmentsUserForShow.length == 0) {
            return res.json({
                success: true,
                message: "This user has not appointments",
            });
        }

        const appointmentDetail = appointmentsUserForShow.find(obj => obj?.id === appointment_id);

        if (appointmentDetail == null) {
            return res.json({
                success: true,
                message: "appointment id incorrect, try again",
            });
        }

        return res.json({
            success: true,
            message: "Here are all your appointments",
            data: appointmentDetail
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments can't be getted, try again",
            error
        })
    }
}

export {
    getAppointmentsUser, createAppointment, updateAppointment, deleteAppointment,
    getAppointmentsByWorker, getallAppointments, getAppointmentDetail
}