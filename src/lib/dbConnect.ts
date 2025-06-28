import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to the database");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGO_URI || "" , {});
        connection.isConnected = db.connections[0].readyState;
        console.log("Database is connected")
    }catch(e){
        console.log("Database connection failed" , e);
        process.exit(1);//Gracefully exit if failed
    }
}

export default dbConnect;