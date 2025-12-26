import mongoose from "mongoose";

import { DEV_DB_URL, NODE_ENV, PROD_DB_URL } from "./server.config.js";

export const connectDB = async ()=>{
    try {
        if(NODE_ENV == 'development'){
            await mongoose.connect(DEV_DB_URL);
        }else if(NODE_ENV == 'production'){
            await mongoose.connect(PROD_DB_URL);
        }
        console.log(`Successfully connected to mongodb database from ${NODE_ENV}`);
    } catch (error) {
        console.log(`Error connecting to database ${error}`)
    }
}