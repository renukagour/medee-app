import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
