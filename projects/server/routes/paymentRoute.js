import express from "express";
import { addPayment, getPayment } from "../controller/paymentController.js";

const routers = express.Router();

routers.post("/add-payment-receipt", addPayment);
routers.get("/get-payment", getPayment);

export default routers;
