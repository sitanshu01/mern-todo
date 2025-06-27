import express from 'express';
import dotenv from 'dotenv';
import {connectDb} from './config/db.js';
import Todo from './models/todo.js';
import todoRoutes from './routes/todo.routes.js';
import path from 'path';
const app = express();
dotenv.config();
connectDb();

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use('/api/todos', todoRoutes);

const __dirname = path.resolve();

if(process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname, "frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    });
}

app.listen(PORT , (err)=>{
    if(err) console.error(err);
    console.log(`server is running at port ${PORT}`);
})

