import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

dotenv.config();


const app = express();
app.use(cors());
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

