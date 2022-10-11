import express from "express";
import {
  addInvoiceHeaders,
  getInvoiceById,
  getInvoiceHeaders,
  getInvoicesByUserId,
  setInvoiceStatus,
} from "../controller/invoiceHeaderController.js";
import { sendOrderNotif } from "../controller/notifController.js";

const routers = express.Router();

routers.post("/addInvoiceHeaders", addInvoiceHeaders);
routers.get("/getInvoiceById/:id", getInvoiceById);
routers.post("/getInvoiceHeaders", getInvoiceHeaders);
routers.post("/getInvoicesByUserId", getInvoicesByUserId);
routers.patch("/setStatus", setInvoiceStatus);

routers.post("/sendNotif", sendOrderNotif); // TEMPORARY

export default routers;
