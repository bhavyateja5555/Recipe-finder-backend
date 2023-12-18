
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./controller/userRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const recipeRoute = require("./controller/recipeRoute");

const app = express()

app.use(cors({
    origin: 'https://recipe-finder-frontend.vercel.app', 
    credentials: true,
}))

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

app.use("/userRoute",userRoute);
app.use("/api/recipes",recipeRoute);

app.use('/images', express.static(__dirname + '/img'));


mongoose.connect("mongodb+srv://test:12345@cluster0.fc8d12u.mongodb.net/recipe",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("open",()=>console.log("Connected to DB"));
db.on("error",()=>console.log("Error occurred"))

app.listen(4000, ()=>{
    console.log("Server started at 4000");
})
