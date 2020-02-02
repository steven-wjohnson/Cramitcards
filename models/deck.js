var mongoose = require('mongoose');

//SCHEMA SETUP
var deckSchema = new mongoose.Schema({
    subject: String, 
    subtitle: String, 
    description: String,
    cards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card"
        }
    ]
});

module.exports = mongoose.model("Deck" ,deckSchema);
