import express from "express";
import {
  getInvoiceById,
  getInvoiceHeaders,
  getInvoicesByUserId,
  setInvoiceStatus,
} from "../controller/invoiceHeaderController.js";
import { sendOrderNotif } from "../controller/temp_notifController.js";

const routers = express.Router();

routers.get("/getInvoiceById/:id", getInvoiceById);
routers.post("/getInvoiceHeaders", getInvoiceHeaders);
routers.post("/getInvoicesByUserId", getInvoicesByUserId);
routers.patch("/setStatus", setInvoiceStatus);

routers.get("/get-invoice", sendOrderNotif); // TEMPORARY

export default routers;
