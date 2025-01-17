import {Router} from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";
import { json } from "stream/consumers";
const router =Router();

router.post("/",authMiddleware,async(req,res)=>{
    console.log("create zap");
    //@ts-ignore
    const id=req.id;
    const body=req.body;
    console.log(JSON.stringify(body));
    const parsedData=ZapCreateSchema.safeParse(body);
    //console.log(JSON.stringify(parsedData.data?.actions));
    if(!parsedData.success){
       return res.status(411).json({
        message:"Incorrect inputs"
       })
    }


   const zapId= await prismaClient.$transaction(async tx=>{
    console.log(JSON.stringify(parsedData.data.actions[0].actionMetaData));
     const zap=   await prismaClient.zap.create({
           data:{
            userId:parseInt(id),
            triggerId:"",
            actions:{
                create:parsedData.data.actions.map((x,index)=>({
                 actionId:x.availableActionId,
                 metadata:x.actionMetaData,
                 sortingOrder:index
                }))
            }
            
           }
        })

      const trigger=  await tx.trigger.create({
         data:{
            triggerId:parsedData.data.availableTriggerId,
            zapId:zap.id
         }
        })
        await tx.zap.update({
            where:{
                id:zap.id
            },
            data:{
                triggerId:trigger.id
            }
        })
        return zap.id;
    });

    

    return res.json({
        zapId
    })
   
})

router.get("/",authMiddleware,async(req,res)=>{
    //@ts-ignore
 const id=req.id;
 const zaps =await prismaClient.zap.findMany({
    where:{
        userId:id
    },
    include:{
        actions:{
            include:{
                type:true
            }
        },
        trigger:{
            include:{
                type:true
            }
        }
    }
 });

 return res.json({
    zaps
 })

})

router.get("/:zapId",authMiddleware,async(req,res)=>{
    console.log("signin Handler");
    //@ts-ignore
    const id=req.id;
    const zapId=req.params.zapId;
    const zaps= await prismaClient.zap.findFirst({
        where:{
            id:zapId,
            userId:id
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
    })
    return res.json({
        zaps
    })
}
);

export const zapRouter=router;