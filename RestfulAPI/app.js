import express from "express";
import dotenv from "dotenv";
import connection from "./models/connection.js";
import bodyParser from "body-parser";
import ArticleModel from "./models/ArticleSchema.js";

dotenv.config();
const app = express();
connection();

// Use body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json()); // to parse JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to parse URL-encoded bodies

const PORT = process.env.PORT || 8000;

////Requesting a All articles
app
  .route("/articles")
  .get(async (req, res) => {
    try {
      const articles = await ArticleModel.find();
      res.json(articles);
    } catch (error) {
      res.status(500).send("Error in articles :" + error);
    }
  })
  .post(async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return req.status(400).send("Title and content ar required");
      }
      const newArticle = new ArticleModel({
        title,
        content,
      });
      await newArticle.save();
      res.send("Article Created Successfully");
    } catch (error) {
      res.status(500).send("Error in article :" + err);
    }
  })
  .delete(async (req, res) => {
    try {
      const { filter } = req.params;

      const deleteArticle = await ArticleModel.deleteMany(filter);
      if (!deleteArticle) {
        return res.status(400).send("filter criteriad required");
      } else {
        res.send("Article deleted successfully");
      }
    } catch (error) {
      res.status(500).send("Error deleting article:" + error);
    }
  });

///Requesting a specific article
app
  .route("/articles/:articlesId")
  .get(async (req, res) => {
    try {
      const foundArticles = await ArticleModel.findOne({
        _id: req.params.articlesId,
      });

      if (!foundArticles) {
        return res.status(404).send("Article are not found");
      } else {
        res.json(foundArticles);
      }
    } catch (err) {
      res.status(500).send("An occurs when fetching article");
    }
  })
  .put(async (req, res) => {   //put updates entire article fields
    try {
     const updateResults = await ArticleModel.updateOne(
        {_id:req.params.articlesId},
        {title: req.body.title,
        content: req.body.content},
        {new: true, overwrite:true }
        );
      if(!updateResults){
       return res.status(404).send("Article not found");
       } 
        res.send("Article updated successfully");
       } catch (error) {
      res.status(500).send("Error updating article :" + error);
    }
  })
 .patch(async (req, res) => {   //updates specific fields or specific changes
  try {
    const updatedWithPatch = await ArticleModel.updateOne(
      {_id: req.params.articlesId},
      {$set: req.body},
    );
    if(!updatedWithPatch){
      return res.status(404).send("Article not found");
    }
    res.send("Article updated successfully");
  } catch (error) {
    res.status(500).send("Error updating article :" + error);
  }
 })
 .delete(async (req, res) => {
  try {
    const deletedResults = await ArticleModel.deleteOne(
      {_id: req. params.articlesId}, 
    )
    if (!deletedResults){
      return res.status(404).send("Article not found");
    }
    res.send("Article deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting article:" + error);
  }
 })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
