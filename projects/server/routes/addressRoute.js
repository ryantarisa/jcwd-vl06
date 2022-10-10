import express from "express";
import {
  addAddress,
  getAddress,
  setMainAddress,
} from "../controller/addressController.js";

const routers = express.Router();

routers.post("/add-address", addAddress);
routers.get("/get-address/:id", getAddress);
routers.patch("/set-main-address", setMainAddress);

export default routers;
