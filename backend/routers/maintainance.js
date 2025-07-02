import express from "express"
import { createMaintainance, getAllMaintenanceRequests, getMaintenanceRequest } from "../controllers/MaintainanceRequestController.js"
import verifyToken from "../utils/verifyToken.js"

const maintainanceRouter = express.Router()

  

maintainanceRouter.get('/get-all-request',verifyToken('admin'),getAllMaintenanceRequests);
  

  export default maintainanceRouter;
