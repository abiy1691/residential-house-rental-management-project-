import express from "express";
import { addOwner, currentTenant, deleteOwner, editProfile, getHouses, getOwner, getSingleHouse, occupancyHistory } from "../controllers/OwnerController.js";
import verifyToken from "../utils/verifyToken.js";
import uploader from "../utils/fileProcessing.js"
import { getOwnerRequests, getVisitRequests } from "../controllers/VisitorController.js";
import { addHouseCalendar, editHouseImages, editHouseInfo } from "../controllers/HouseController.js";
import { addTenant, deleteTenant } from "../controllers/TenantController.js";
import { changeStatus, getMaintenanceRequest } from "../controllers/MaintainanceRequestController.js";
import { ownerPaymentHistory, paymentStats, verifyPayment } from "../controllers/PaymentController.js";

const ownerRouter  = express.Router();

ownerRouter.put('/maintenance/:requestid',verifyToken('owner'), changeStatus);
ownerRouter.get('/maintenance',verifyToken('owner'), getMaintenanceRequest);
ownerRouter.get('/payment', verifyToken('owner'), paymentStats);
ownerRouter.get('/houses', verifyToken('owner'), getHouses);
ownerRouter.get('/houses/:houseid', verifyToken('owner'), getSingleHouse);
ownerRouter.get('/requests', verifyToken('owner'), getOwnerRequests);
ownerRouter.post('/:houseid/calendar', verifyToken('owner'), addHouseCalendar);
ownerRouter.post('/:houseid/:paymentid', verifyToken('owner'), verifyPayment);
ownerRouter.get('/history', verifyToken('owner'), occupancyHistory);
ownerRouter.get('/payments', verifyToken('owner'), ownerPaymentHistory);
ownerRouter.get('/:houseid/tenant', verifyToken('owner'), currentTenant);
ownerRouter.delete('/:houseid/tenant', verifyToken('owner'), deleteTenant);
ownerRouter.get('/:username', getOwner);
ownerRouter.put('/:houseid/images', verifyToken('owner'), uploader.array('images', 10), editHouseImages);
ownerRouter.post('/:houseid', verifyToken('owner'), uploader.fields([{name:'nationalid', maxCount: 1, minCount: 1}, {name:'contract', maxCount: 1, minCount: 1}]), addTenant);
ownerRouter.put('/:houseid', verifyToken('owner'), editHouseInfo);
ownerRouter.put('/', verifyToken('owner'), uploader.single('nationalid'), editProfile);
ownerRouter.post('/', verifyToken("user"), uploader.single('nationalid'), addOwner);
ownerRouter.delete('/', verifyToken("owner"), deleteOwner);

export default ownerRouter;
