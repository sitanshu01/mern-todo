import mongoose from "mongoose";

export const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("connected..");
    } catch (error) {
        console.error(error);
        process.exit(1); //it will exit
    }
}

