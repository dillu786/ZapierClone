import  express from "express";
import { PrismaClient } from "@prisma/client";
const app=express();
app.use(express.json());
const client =new PrismaClient();
app.get("/hooks",(req,res)=>{
    res.json({
        message:"Hello"
    })
})
app.post("/hooks",(req,res)=>{
    
    res.json({
        message:"Hello",
        body:req.body
    })
})
app.post("/hooks/catch/:userid/:zapid",async(req,res)=>{
    console.log('Hi');
    const userid=req.params.userid;
    const zapid=req.params.zapid;
    const body=req.body;

    await client.$transaction(async tx=>{
        const run= await tx.zapRun.create({
            data:{
                zapId:zapid,
                metadata:body
            }
        })
        await tx.zapRunOutbox.create({
            data:{
                zapRunId:run.id
               
            }
        });

     res.json({
        message:"WebHook Received"
     })

    });

   
});


app.listen(3000);

