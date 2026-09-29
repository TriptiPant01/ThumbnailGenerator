import express from 'express'
import { deleteThumnail, generateThumbnail } from '../controllers/ThumbnailController.js'

const ThumnailRouter = express.Router()

ThumnailRouter.post('/generate', generateThumbnail);
ThumnailRouter.delete('/delete/:id', deleteThumnail)


export default ThumnailRouter