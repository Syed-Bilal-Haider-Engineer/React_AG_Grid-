import { app } from './app.js'; // Ensure the path is correct
import 'dotenv/config'
import connectDB from './src/DB/db.js';
const port = process.env.PORT || 8000;

process.on("uncaughtException",()=>{
 console.error("Uncaught exception, shutting down...");
 process.exit(1);
})

connectDB(process.env.DB_URL)
app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection",()=>{
 console.error("Unhandled rejection, shutting down...");
 app.close(()=>{
 process.exit(1);
 })
})