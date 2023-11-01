import { Request, Response } from "express-serve-static-core"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User"
import { Portfolio } from "../models/Portfolio"
import { Appointment_portfolio } from "../models/Appointment_portfolio"
import { validateAvailableDate, validateDate, validateEmail, validateNumber, validateShift, validateString } from "../validations/validations"

const getAppointmentsUser = async (req: Request, res: Response) => {

    try {
        const { id } = req.token

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
            where: {
                client_id: id
            },
            relations: ["appointmentPortfolios"],
            skip: skip,
            take: pageSize
        })

        const appointmentsUserForShows = await Promise.all(appointmentsUser.map(async (obj) => {
            const { status, worker_id, client_id, appointmentPortfolios, ...rest } = obj;
            const nameProduct = obj.appointmentPortfolios.map((obj) => obj.name,)
            const categoryProduct = obj.appointmentPortfolios.map((obj) => obj.category)

            const worker = await User.findOneBy({
                id: worker_id
            });

            if (worker) {
                const full_name = worker.full_name
                const email = worker.email;
                const is_active = worker.is_active;
                const name = nameProduct[0]
                const category = categoryProduct[0]
                return { name, category, email, full_name, is_active, ...rest };
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
        const { date, shift, email, name: purchase_Name } = req.body;
        const { id } = req.token;

        if (validateDate(date)) {
            return res.json({ success: true, message: validateDate(date) });
        }

        if (validateShift(shift)) {
            return res.json({ success: true, message: validateShift(shift) });
        }

        if (validateString(purchase_Name, 100)) {
            return res.json({ success: true, message: validateString(purchase_Name, 100) });
        }

        if (validateEmail(email)) {
            return res.json({ success: true, message: validateEmail(email) });
        }

        const validationResult = await validateAvailableDate(date, email, shift);
        if (!validationResult.isValid) {
            return res.json({
                success: true,
                message: validationResult.message
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

        const getPurchaseItems = await Portfolio.find()
        const mapPortfolio = getPurchaseItems.map((obj) => obj.name)

        if (!mapPortfolio.includes(purchase_Name)) {
            return res.json({
                success: true,
                message: "the name of the item purchase doesn't exist",
            })
        }

        const createNewAppointment = await Appointment.create({
            date,
            shift,
            worker_id: loginByEmail.id,
            client_id: id
        }).save()

        const getPortfolio = await Portfolio.findOneBy({
            name: purchase_Name
        })

        await Appointment_portfolio.create({
            appointment_id: createNewAppointment.id,
            portfolio_id: getPortfolio?.id
        }).save()

        return res.json({
            success: true,
            message: "appointment created succesfully",
            data: {
                date: createNewAppointment.date,
                shift: createNewAppointment.shift,
                workerName: loginByEmail.full_name,
                email: email,
                id: createNewAppointment.id,
                purchaseName: getPortfolio?.name,
                category: getPortfolio?.category,
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
        const { id, date, shift, email, name } = req.body
        const { id: client_id } = req.token

        if (validateNumber(id, 7)) {
            return res.json({ success: true, message: validateNumber(id, 7) });
        }

        if (validateDate(date)) {
            return res.json({ success: true, message: validateDate(date) });
        }

        if (validateShift(shift)) {
            return res.json({ success: true, message: validateShift(shift) });
        }

        if (validateString(name, 50)) {
            return res.json({ success: true, message: validateString(name, 50) });
        }

        if (validateEmail(email)) {
            return res.json({ success: true, message: validateEmail(email) });
        }

        const validationResult = await validateAvailableDate(date, email, shift);
        if (!validationResult.isValid) {
            return res.json({
                success: true,
                message: validationResult.message
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

        const getPurchaseItems = await Portfolio.find()
        const mapPortfolio = getPurchaseItems.map((obj) => obj.name)

        if (!mapPortfolio.includes(name)) {
            return res.json({
                success: true,
                message: "the name of the item purchase doesn't exist",
            })
        }

        const nameProduct = await Portfolio.findOneBy({
            name
        })

        await Appointment.update({
            id
        }, {
            date,
            shift,
            worker_id
        })

        await Appointment_portfolio.update({
            appointment_id: id
        }, {
            portfolio_id: nameProduct?.id
        })

        const dataAppointmentUpdated = await Appointment.findOneBy({
            id
        })

        return res.json({
            success: true,
            message: "appointment created succesfully",
            data: {
                date,
                shift,
                workerName: findWorker_id?.full_name,
                email,
                id: id,
                purchaseName: name,
                category: nameProduct?.category,
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
        const { id: deleteById } = req.body
        const { id: clientId } = req.token

        if (validateNumber(deleteById, 7)) {
            return res.json({ success: true, message: validateNumber(deleteById, 7) });
        }

        const getUser = await Appointment.findBy({
            client_id: clientId
        })

        const appointments_id = getUser.map((appointment) =>
            appointment.id
        )

        if (!appointments_id.includes(deleteById)) {
            return res.json({
                success: true,
                message: "you can`t delete this appointment",
            })
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
        const { id } = req.token

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
            relations: ["appointmentPortfolios"],
            skip: skip,
            take: pageSize
        })

        const appointmentsWorkerForShows = await Promise.all(appointmentsWorker
            .filter((obj) => obj.status === false)
            .map(async (obj) => {
                const { worker_id, client_id, appointmentPortfolios, ...rest } = obj;
                const nameProduct = obj.appointmentPortfolios.map((obj) => obj.name,)
                const categoryProduct = obj.appointmentPortfolios.map((obj) => obj.category)

                const client = await User.findOneBy({
                    id: client_id
                });
                if (client) {
                    const name = nameProduct[0]
                    const category = categoryProduct[0]
                    const client_name = client.full_name
                    const client_email = client.email;
                    const is_active = client.is_active;
                    return { name, category, client_name, client_email, is_active, ...rest };
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
            relations: ["appointmentPortfolios"],
            skip: skip,
            take: pageSize
        })

        const appointmentsUserForShows = await Promise.all(appointmentsUser.map(async (obj) => {
            const { worker_id, client_id, appointmentPortfolios, ...rest } = obj;
            const nameProduct = obj.appointmentPortfolios.map((obj) => obj.name,)
            const categoryProduct = obj.appointmentPortfolios.map((obj) => obj.category)

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
                const name = nameProduct[0]
                const category = categoryProduct[0]

                return {
                    ...rest, name, category, client_is_active, client_name, client_email,
                    worker_name, worker_email, worker_is_active
                };
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
        const { id: appointmentId } = req.body
        const { id } = req.token

        if (validateNumber(appointmentId, 7)) {
            return res.json({ success: true, message: validateNumber(appointmentId, 7) });
        }

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

        const appointmentDetail = appointmentsUserForShow.find(obj => obj?.id === appointmentId);

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

const appointmentValidation = async (req: Request, res: Response) => {

    try {
        const { email: emailWorker, date, shift } = req.body
        const { id } = req.token

        if (validateEmail(emailWorker)) {
            return res.json({ success: true, message: validateEmail(emailWorker) });
        }

        if (validateDate(date)) {
            return res.json({ success: true, message: validateDate(date) });
        }

        if (validateShift(shift)) {
            return res.json({ success: true, message: validateShift(shift) });
        }

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const todayFormatDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        if (todayFormatDate > date) {
            return res.json({
                success: true,
                message: "This appointment is dated before today, try again"
            });
        }

        const workerInfo = await User.findOneBy({
            email: emailWorker
        })

        if (workerInfo?.role_id !== 2) {
            return res.json({
                success: true,
                message: "worker not found, try again"
            });
        }

        const allAppointmentsByWorker = await Appointment.findOneBy({
            date,
            shift,
            worker_id: workerInfo?.id
        })

        if(!allAppointmentsByWorker){
            return res.json({
                success: true,
                message: "This appointment not exist"
            });
        }

        const client_id = allAppointmentsByWorker?.client_id

        if (id !== client_id){
            return res.json({
                success: true,
                message: "this appointment it`s not yours"
            });
        }

        return res.json({
            success: true,
            message: "this appointment is yours and has been successfully"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments cannot be retrieved, please try again",
            error
        })
    }
}

export {
    getAppointmentsUser, createAppointment, updateAppointment, deleteAppointment,
    getAppointmentsByWorker, getallAppointments, getAppointmentDetail, appointmentValidation
}