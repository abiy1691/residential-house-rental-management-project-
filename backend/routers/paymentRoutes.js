import express from "express"
import {createSubaccount } from "../controllers/ChapaController.js";


const paymentRouter  = express.Router();
 
// paymentRouter.get('/payment-initialization',paymentInitializtion)
paymentRouter.get('/get-banks',createSubaccount)

export  default paymentRouter
