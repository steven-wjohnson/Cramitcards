var mongoose = require('mongoose'),
    AutoIncrement = require('mongoose-sequence')(mongoose);

//SCHEMA SETUP
var cardSchema = new mongoose.Schema({
    card_id: {type: Number, default: 0 },
    question: String, 
    answer: String
});

cardSchema.plugin(AutoIncrement, {inc_field: 'card_id'});
module.exports = mongoose.model("Card" ,cardSchema);