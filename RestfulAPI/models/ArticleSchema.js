import mongoose from "mongoose";
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})

const ArticleModel = mongoose.model("Article", articleSchema);

export default ArticleModel;