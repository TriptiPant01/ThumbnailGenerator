import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import { connectToMongoDB } from "./config/db.js";
import session from "express-session";
import MongoStore from 'connect-mongo'
import AuthRouter from "./routes/AuthRoutes.js";
import ThumnailRouter from "./routes/ThumnailRoutes.js";
import UserRouter from "./routes/UserRoutes.js";


declare module 'express-session' {
    interface SessionData {
        isLoggedIn: boolean;
        userId: string
    }
}

await connectToMongoDB()
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000','https://thumbnail-api-git-main-triptipant01s-projects.vercel.app','https://thumbnail-server-ten.vercel.app/'],
    credentials: true,
}))

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7days
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL as string,
        collectionName: 'sessions'
    })
    
}))

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/auth', AuthRouter)
app.use('/api/thumbnail', ThumnailRouter)
app.use('/api/user', UserRouter)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
export default app;