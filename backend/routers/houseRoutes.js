import express from "express";
import { createHouse, deleteHouse, getHouse, getHouseVisits, getHouses } from "../controllers/HouseController.js";
import uploader from "../utils/fileProcessing.js";
import verifyToken from "../utils/verifyToken.js";

const houseRouter  = express.Router();
houseRouter.post('/', verifyToken('owner'), uploader.array('images', 10), createHouse);
houseRouter.get('/:id/visitrequests', getHouseVisits);
houseRouter.get('/:id', getHouse);
houseRouter.delete('/:id', verifyToken('owner'), deleteHouse);
houseRouter.get('/', getHouses);


export default houseRouter