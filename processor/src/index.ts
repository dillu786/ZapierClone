import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";

const client =new PrismaClient();

const TOPIC_NAME="zap-events";
const kafka=new Kafka({
    clientId:"outbox-processor",
    brokers:["localhost:9092"]
});

async function main() {
    const producer=kafka.producer()
    await producer.connect();

    while(1){
        const pendingrows= await client.zapRunOutbox.findMany({
            where:{},
            take:10
        });
       
        producer.send({
            topic:TOPIC_NAME,
            messages: pendingrows.map(msg=>{
                return {
                    value: msg.zapRunId
                }
            })
        })

        await client.zapRunOutbox.deleteMany({
            where:{
                id:{
                    in:pendingrows.map(a=>a.id)
                }
            }
        })
    }


}

main();