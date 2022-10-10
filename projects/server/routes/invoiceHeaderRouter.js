import express from "express";
import {
  addInvoiceHeaders,
  getInvoiceById,
  getInvoiceHeaders,
  getInvoicesByUserId,
  setInvoiceStatus,
} from "../controller/invoiceHeaderController.js";

const routers = express.Router();

routers.post("/addInvoiceHeaders", addInvoiceHeaders);
routers.get("/getInvoiceById/:id", getInvoiceById);
routers.post("/getInvoiceHeaders", getInvoiceHeaders);
routers.post("/getInvoicesByUserId", getInvoicesByUserId);
routers.patch("/setStatus", setInvoiceStatus);

export default routers;
