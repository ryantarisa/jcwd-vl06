import express from "express";
import {
  addAddress,
  delAddress,
  getAddress,
  setMainAddress,
} from "../controller/addressController.js";

const routers = express.Router();

routers.post("/add-address", addAddress);
routers.get("/get-address/:id", getAddress);
routers.patch("/set-main-address", setMainAddress);
routers.delete("/delete-address/:id", delAddress);

export default routers;
