import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";


dotenv.config();


const app = express();
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
connectDB();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/",(req,res)=>{
    res.send("Server is Up!");
})

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

