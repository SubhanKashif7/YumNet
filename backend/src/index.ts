import dotenv from "dotenv";
import connectToDatabase from "./database/connectToDatabase";
import app from "./app/app";

dotenv.config({ path: "./.env" });

connectToDatabase().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`App running Successfully on port: ${process.env.PORT}`);
  }).on('error', (err: Error) => {
    console.log("Express App error:", err);
  });
}).catch((err: Error) => {
  console.log("Database connection error:", err);
});