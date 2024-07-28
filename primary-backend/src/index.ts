import express from "express";
import {userRouter} from "./router/user"
import {zapRouter}  from "./router/zap"
import { triggerRouter } from "./router/trigger";
import {actionRouter} from "./router/action";
import cors from "cors";
const app =express();
app.use(express.json());
app.get("/",(req,res)=>{
    res.json({
       message: "Hello"
    });
})
app.use(cors());
app.use("/api/v1/user",userRouter);
app.use("/api/v1/zap",zapRouter);
app.use("/api/v1/trigger",triggerRouter);
app.use("/api/v1/action",actionRouter);
app.listen(3001);