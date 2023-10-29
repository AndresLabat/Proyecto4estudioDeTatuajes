import { Request, Response } from "express-serve-static-core"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User"

const getAppointment = async (req: Request, res: Response) => {


}

const createAppointment = async (req: Request, res: Response) => {

    try {
        const appointmentBody = req.body
        const email = req.body.email
        const id = req.token.id

        const loginByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if(loginByEmail?.role.role_name != "admin"){
            return res.json({
                success: true,
                message: "sorry, this user isn't a worker, try again"
            })
        }

        if(id == loginByEmail.id){
            return res.json({
                success: true,
                message: "sorry, you can't create a appointment with yourself"
            })
        }

        // VALIDACIONES DE FECHAS Y HORAS A HACER A TRAVAS DE LA LIBRERIA 
        // https://www.npmjs.com/package/dayjs


        // if(createNewAppointment.date ==   && createNewAppointment.time == ){
        //     return res.json({
        //         success: true,
        //         message: "sorry, you can't create a appointment with yourself"
        //     })
        // }
            
        const createNewAppointment = await Appointment.create({
            date: appointmentBody.date,
            time: appointmentBody.time,
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
        const body = req.body

        const appointmentId = body.id
        const date = body.date
        const time = body.time
        const email = body.email

        //----------------------------------------------------------------
        const findWorker_id = await User.findOneBy({
            email
        })

        const worker_id = findWorker_id?.id
        //----------------------------------------------------------------

        const appointmentsClient = await Appointment.findBy({
            client_id,
        })

        const appointmentsId = await appointmentsClient.map((object)=>
            object.id
        )

        console.log(appointmentsId);
        
        if(!appointmentsId.includes(appointmentId)){
            return res.json({
                success: true,
                message: "appointment updated not succesfully, incorrect id"
            })
        }

        await Appointment.update({
            id: appointmentId
        },{
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

        if(!deleteById){
            return res.json({
                success: true,
                message: "you must insert one id",
            })
        }

        // me traes todas las citas del cliente que te digo:
        const getUser = await Appointment.findBy({
            client_id: clientId
        })

        // accede a los ids de esas citas y metelos en un array
        const appointments_id = getUser.map((appointment)=>
        appointment.id
        ) 

        if(!appointments_id.includes(deleteById)){
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

export{getAppointment, createAppointment, updateAppointment, deleteAppointment}