import express from "express";
import { editProfile, forgetPassword, getUser, getUserById, login, logout, refreshToken, register, resetPassword } from "../controllers/UserController.js";
import verifyToken from "../utils/verifyToken.js";
import { createVisitorRequest, deleteRequest, getRequests } from "../controllers/VisitorController.js";

const userRouter  = express.Router();
userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.post('/refresh', refreshToken);
userRouter.post('/logout', verifyToken('user', 'owner', 'admin', 'tenant'), logout);
userRouter.post('/resetpassword', resetPassword);
userRouter.post('/forgetpassword', forgetPassword);
userRouter.get('/schedules', verifyToken('user', 'owner', 'tenant'), getRequests);
userRouter.delete('/schedules/:id', verifyToken('user', 'owner', 'tenant'), deleteRequest);
userRouter.put('/:username', verifyToken('user'), editProfile);
userRouter.get('/:id', getUserById);
userRouter.post('/:houseid', verifyToken('user', 'owner'), createVisitorRequest);
userRouter.get('/', verifyToken('user', 'owner', 'tenant'), getUser);


export default userRouter