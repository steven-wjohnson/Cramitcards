let express = require('express'), 
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    Deck = require('./models/deck'),
    Card = require('./models/card');

//SETUP

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/cramit_cards", {useNewUrlParser: true, useUnifiedTopology: true});

//----------------------------------------------------------------------------------------
//ROUTES

//Default
app.get("/", (req, res) => {
    res.render("landing");
});

//Index
app.get("/decks", (req, res) => {
    //get all decks from database
    Deck.find({}, (err, allDecks) => {
        if(err){
            console.log(err);
        } else {
            res.render("index", {decks: allDecks});
        }
    })
});

//New Deck
app.get("/decks/new", (req, res) => {
    res.render("decks_add");
});

//New Card
app.get("/decks/:id/cards/new", (req, res) => {
    //find deck by id
    Deck.findById(req.params.id, (err, returnedDeck) => {
        if(err){
            console.log(err);
        } else {
            res.render("cards_add", {deck: returnedDeck});
        }
    })
});


//Create Deck
app.post("/decks", (req, res) => {
    //Get data from form
    let subject = req.body.subject;
    let subtitle = req.body.subtitle;
    let description = req.body.description;
    let newDeck = {subject: subject, subtitle: subtitle, description: description};
    //Save deck into db
    Deck.create(newDeck, (err, new_deck) => {
        if(err){
            console.log(err);
        } else {
            //redirect
            res.redirect('/decks');
        }
    })
});

//Create Card
app.post("/decks/:id/cards", (req, res) => {
    //Find the deck the card will be associated to
    Deck.findById(req.params.id, (err, returnedDeck) => {
        if(err){
            console.log(err);
            res.redirect("/decks");
        } else {
            //Save card into db
            Card.create(req.body.card, (err, new_card) => {
                if(err){
                    console.log(err);
                } else {
                    //Associate the new card with the deck that owns it
                    returnedDeck.cards.push(new_card);
                    returnedDeck.save();
                    //redirect
                    res.redirect(`/decks/${returnedDeck._id}`);
                }
            })
        }
    })
});

//Show
app.get("/decks/:id", (req, res) => {
    Deck.findById(req.params.id).populate("cards").exec((err, returnedDeck) => {
        if(err){
            res.redirect("/decks");
        } else {
            res.render("cards", {deck: returnedDeck});
        }
    })
});

//Edit
app.get("/decks/:id/edit", (req, res) => {
    //find the deck by id and load the edit form with deck data
    Deck.findById(req.params.id, (err, returnedDeck) => {
        if(err){
            res.redirect("/decks");
        } else {
            res.render("decks_edit", {deck: returnedDeck});
        }
    })
});

//Update
app.put("/decks/:id", (req, res) => {
    //find and update the deck
    Deck.findByIdAndUpdate(req.params.id, req.body.deck, (err, updatedDeck) => {
        if(err){
            res.redirect("/decks");
        } else {
            res.redirect(`/decks/${req.params.id}`);
        }
    })
});

//Destroy
app.delete("/decks/:id", (req, res) => {
    //find deck by id and delete and redirect
    Deck.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/decks");
        } else {
            res.redirect("/decks");
        }
    })
});

//----------------------------------------------------------------------------------------
//Listener
app.listen("3000", () => {
    console.log("Listening on port 3000");
    console.log("Running CramItCards");
})