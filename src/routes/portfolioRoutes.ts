import { Router } from "express";
import { getPortfolio } from "../controllers/portfolioControllers";

const router = Router();

router.get('/get', getPortfolio)

export {router}