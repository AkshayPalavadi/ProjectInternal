import mongoose from "mongoose";

const bestEmployeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  image: String, // filename saved by multer
  month: String,
});

export default mongoose.model("BestEmployee", bestEmployeeSchema);
