import { Kafka } from "kafkajs";
const TOPIC_NAME="zap-events";

const kafka=new Kafka({
    clientId:"outbox-processor",
    brokers:["localhost:9092"]
});

async function  main () {
    const consumer=kafka.consumer({groupId:'main-worker'});
    await consumer.connect();
    await consumer.subscribe({
        topic:TOPIC_NAME,fromBeginning:true
    })

    await new Promise(r=>setTimeout(r,3000));
    await consumer.run({
        autoCommit:false,
        eachMessage:async ({topic,partition,message})=>{
        console.log({
            offset:message.offset,
            partition,
            value:message.value?.toString(),
        }
        )
        }
    })
}

main();