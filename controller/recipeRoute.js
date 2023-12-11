const express = require("express");
const Category= require("../model/Category");
const Recipe = require("../model/Recipe");
const recipeRoute = express.Router();

recipeRoute.use(express.json());
recipeRoute.use(express.urlencoded({ extended: true }));

recipeRoute.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } 
  catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

recipeRoute.get('/all-categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } 
  catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

recipeRoute.get('/latest-recipes', async (req, res) => {
  try {
    const latestRecipes = await Recipe.find().sort({ _id: -1 }).limit(5);
    res.json(latestRecipes);
  } 
  catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest recipes' });
  }
});

recipeRoute.get('/all-recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } 
  catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

recipeRoute.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } 
  catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

recipeRoute.post('/submit-recipes', async (req, res) => {
  try {
    const newRecipe = await Recipe.create(req.body);
    res.status(201).json(newRecipe);
  } 
  catch (error) {
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

recipeRoute.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const foundRecipes = await Recipe.find({ name: { $regex: new RegExp(query, 'i') }, });
    res.json(foundRecipes);
  } 
  catch (error) {
    console.error('Error searching for recipes:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

recipeRoute.put('/update-recipe/:id', async (req, res) => {
  const { id } = req.params;
  const { name, ingredients, description, category, image } = req.body;
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate( id, { name, ingredients, description, category, image }, { new: true });
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(updatedRecipe);
  } 
  catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

recipeRoute.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Received recipe ID for deletion:', id); 
  try {
    const deletedRecipe = await Recipe.findByIdAndRemove(id);
    if (!deletedRecipe) {
      console.log('Recipe not found'); 
      return res.status(404).json({ message: 'Recipe not found' });
    }
    console.log('Recipe deleted successfully!'); 
    res.json({ message: 'Recipe deleted successfully' });
  } 
  catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

recipeRoute.get('/recipes-by-category/:categoryName', async (req, res) => {
  const { categoryName } = req.params;
  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const recipesByCategory = await Recipe.find({ category: categoryName });
    if (recipesByCategory.length === 0) {
      return res.status(404).json({ message: 'No recipes found for this category' });
    }
    res.json(recipesByCategory);
  } 
  catch (error) {
    console.error('Error fetching recipes by category:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = recipeRoute;
