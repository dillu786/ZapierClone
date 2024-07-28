import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "./config";
export function authMiddleware (req:Request,res:Response,next:NextFunction){

    const token=req.headers.authorization as unknown as string;
    try{
        console.log(token);
        const payload=jwt.verify(token,JWT_PASSWORD);
        console.log(payload);
        if(payload){
            //@ts-ignore
            req.id=payload.id
        }
        next();
    }
    catch(error){
        console.log(error);
        res.status(403).json({
            message:"token not authenticated"
        })

    }
   
}