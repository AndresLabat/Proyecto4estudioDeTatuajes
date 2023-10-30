import { Request, Response } from "express-serve-static-core"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User"
import { Portfolio } from "../models/Portfolio"
import { Appointment_portfolio } from "../models/Appointment_portfolio"

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
                const full_name = worker.full_name
                const email = worker.email;
                const is_active = worker.is_active;
                // producto a consumir del portfolio
                return { full_name, email, is_active,...rest };
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
        const mapPortfolio = getPurchaseItems.map((obj)=>obj.name)

        if(!mapPortfolio.includes(purchase_Name)){
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
            name:purchase_Name
        })

        const createAppointment = await Appointment_portfolio.create({
            appointment_id:createNewAppointment.id,
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
        const mapPortfolio = getPurchaseItems.map((obj)=>obj.name)

        if(!mapPortfolio.includes(name)){
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

        const appointmentsWorker = await Appointment.findBy({
            worker_id: id
        })

        const appointmentsUserForShows = await Promise.all(appointmentsWorker.map(async (obj) => {
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
            message: "Here are all your appointments as employee",
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

const getallAppointments = async (req: Request, res: Response) => {
  

    try {
        const id = req.token.id

        const appointmentsUser = await Appointment.find()
 
        const appointmentsUserForShows = await Promise.all(appointmentsUser.map(async (obj) => {
            const { status, worker_id, client_id, ...rest } = obj;
            
            const user = await User.findOneBy({ 
                id: client_id
            });

            if (user) {
                const email = user.email;
                const full_name = user.full_name;
                const is_active = user.is_active;
                return { is_active, email,full_name,...rest,  };
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

const getAppointmentDetail = async (req: Request, res: Response) => {
}

export { getAppointmentsUser, createAppointment, updateAppointment, deleteAppointment,
    getAppointmentsByWorker, getallAppointments, getAppointmentDetail }