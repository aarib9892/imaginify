import mongoose , {Mongoose} from 'mongoose'

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null
}
let cached : MongooseConnection = (global as any).mongoose
if(!cached){
    cached = (global as any).mongoose = {
        conn:null , promise:null
    }
}

export const connectToDatabase = async () =>{
    console.log('Connecting to database...')
    if(cached.conn) return cached.conn
    if(!MONGODB_URL) throw new Error('Missing MONGODB_URL')
     try {
       cached.promise =
         cached.promise ||
         mongoose.connect(MONGODB_URL, {
           dbName: "imaginify",
           bufferCommands: false,
         });

       cached.conn = await cached.promise;
       console.log("✅ Connected to database successfully");
     } catch (error) {
       console.error("❌ Failed to connect to database:", error);
       throw error; // Let it bubble if needed
     }
    return cached.conn
}