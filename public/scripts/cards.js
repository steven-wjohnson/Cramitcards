
var listItem1 = document.querySelectorAll(".list-group > li")[0];
    listItem1.classList.add("active");

var oldCards = [];

document.getElementById("list").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");

    //get the card with the id that matches the selected list item
    var list_id = e.target.id;
    var targetCard_id = "card-id" + list_id;
    var initCard = document.getElementById("init");
    var selectedCard = document.querySelector(`#${targetCard_id}`);

    //save the card that is displayed so we can hide it next time
    oldCards.push(selectedCard);
    if(oldCards.length > 1){
        oldCards[0].style.display = "none";
        oldCards.shift();
    }

    //show the card that matches the id of the selected list item
    initCard.style.display = "none";
    selectedCard.style.display = "flex";

});

