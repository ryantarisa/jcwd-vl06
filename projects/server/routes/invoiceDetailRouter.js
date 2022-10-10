import express from "express";
import { addInvoiceDetail } from "../controller/invoiceDetailsController.js";

const routers = express.Router();

routers.post("/addInvoiceDetail", addInvoiceDetail);

export default routers;
