import express from 'express'
import { getThumnailById, getUsersThumnails } from '../controllers/UserController.js';

const UserRouter = express.Router();
UserRouter.get('/thumbnails', getUsersThumnails)
UserRouter.get('/thumnail/:id', getThumnailById)

export default UserRouter