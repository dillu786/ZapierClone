import {Router} from "express";
import { authMiddleware } from "../middleware";
import {signinSchema,signupSchema} from "../types/index"
import { prismaClient } from "../db";
import jwt from "jsonwebtoken";
import {JWT_PASSWORD} from "../config"
const router =Router();


router.post("/signup",async (req,res)=>{
    console.log("signup handler");
    const body=req.body;
    const parsedData=signupSchema.safeParse(body);
    if(!parsedData.success){
        return res.status(411).json({
        message:"Incorrect inputs"
       })
    }

    try{
        const userExists= await prismaClient.user.findFirst({
            where:{
                email: parsedData.data.username
            }
        });
        if(userExists){
            return res.status(403).json({
                message:"User already exists"
            })
        }
        
        const user= await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        });
        
      ///// await sendEmail

        res.status(201).json({
            message:"Please verify your account"
        });
    }

    catch(error ){
      console.error(error);
      res.status(500).json({
        message:"Internal server Error"
      })
    }
    
});

router.post("/signin",async(req,res)=>{
 
   const body= req.body;
   const parsedData=signinSchema.safeParse(body);
   if(!parsedData.success){
    return res.status(411).json({
        message:"Incorrect inputs"
    })
   }

   const user=await prismaClient.user.findFirst({
    where:{
        email:parsedData.data.username,
        password:parsedData.data.password
    }});

    if(!user){
        return res.status(403).json({
            message:"Wrong Credentials entered"
        });
    }

    const token=jwt.sign({
       id:user.id
    },JWT_PASSWORD)

     res.json({
        token:token
     })

    })


router.get("/", authMiddleware,async (req,res)=>{
    console.log("signin Handler");
    //@ts-ignore
    const id=req.id;
    const user=await prismaClient.user.findFirst({
        where:{
            id:id
        },
        select:{
            name:true,
            email:true
        }
    })

    return res.json({
        user
    })
}
);

export const userRouter=router;