import { Request, Response } from "express-serve-static-core"
import { Portfolio } from "../models/Portfolio";

const getPortfolio = async (req: Request, res: Response) => {

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

        const portfolio = await Portfolio.find({
            skip: skip,
            take: pageSize
        })

        if (portfolio.length == 0) {
            return res.json({
                success: true,
                message: "The portfolio is empty",
                data:portfolio
            });
        }

        return res.json({
            success: true,
            message: "Explore our portfolio",
            data: portfolio
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "portfolio can't be getted, try again",
            error
        })
    }
}

export {getPortfolio}
