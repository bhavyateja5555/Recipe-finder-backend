const mongoose = require("mongoose");
const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Indian','Thai','American','Chinese','Mexican','Japanese','Italian','Spanish','Desserts','Soups',
        'French','Australian','Greek','Vietnamese','Brazilian','Korean','Russian','Egyptian','Argentinian','African',
        'German','Irish','Swedish','Indonesian','Turkish','Portugese','Iranian','Nigerian'],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    
});

RecipeSchema.index({name: 'text', ingredients: 'text'});


module.exports = mongoose.model("Recipe", RecipeSchema)