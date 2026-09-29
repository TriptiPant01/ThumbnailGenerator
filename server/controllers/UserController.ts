import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";


export const getUsersThumnails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session
        const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 })
        res.json({
            thumbnails
        })
    }

    catch (err:any) {
        console.log(err)
        res.status(500).json({message:err.message})
    }
}

//controllers to get single Thumnail of a user

export const getThumnailById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session
        const { id } = req.params
        const thumbnail = await Thumbnail.findOne({ userId, _id: id })
        res.json({thumbnail})
    

    }

    catch (err:any) {
        console.log(err)
        res.status(500).json({message:err.message})
    }
}