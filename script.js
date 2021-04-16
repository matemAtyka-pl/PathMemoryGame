const config = {
    width: 8,
    height: 6,
    items: 12,
    isValidNewSpot: (x, y, grid) =>
        grid[x] && grid[x][y] ? false :
        grid[x-1] && grid[x-1][y] ? false :
        grid[x+1] && grid[x+1][y] ? false :
        grid[x] && grid[x][y-1] ? false :
        grid[x] && grid[x][y+1] ? false :
        ((grid[x-1] && grid[x-1][y-1] ? 1 : 0) +
        (grid[x+1] && grid[x+1][y-1] ? 1 : 0) +
        (grid[x-1] && grid[x-1][y+1] ? 1 : 0) +
        (grid[x+1] && grid[x+1][y+1] ? 1 : 0)) <= 1,
    defaultGrid: () => {
        var grid = new Array();
        var width = 8;
        while(width-- > 0) {
            var height = 6;
            grid[width] = new Array();
            while(height-- > 0) {
                grid[width][height] = 0;
            }
        }
        return grid;
    }
};

const addNewItem = (grid, n) => {
    while(true){
        var x = Math.floor(Math.random() * config.width); 
        var y = Math.floor(Math.random() * config.height);
        if(config.isValidNewSpot(x, y, grid)) {
            grid[x][y] = n;
            return;
        }
    }
};

const getUnusedCoordinates = (grid) => {
    while(true){
        var x = Math.floor(Math.random() * config.width); 
        var y = Math.floor(Math.random() * config.height);
        if(config.isValidNewSpot(x, y, grid)) {
            return [x, y];
        }
    }
};

const positionGridId = (x, y) => "pos_"+x+"_"+y;
const jqGridId = (x, y) => "#pos_"+x+"_"+y;

const getLeft = (x) => (1 + 11 * x) + "vmin";
const getTop = (y) => (89 - 11 * y) + "vmin";

const getXYPosition = (jqName, x, y) => {
    $(jqName).css("left", getLeft(x));
    $(jqName).css("top", getTop(y));
};

const paintGrid = (grid) => {
    for(var x = 0; x < config.width; x++)
    for(var y = 0; y < config.height; y++) {
        if(document.getElementById(positionGridId(x, y))) {} else {
            var element = document.createElement("div");
            element.id = positionGridId(x, y);
            document.body.appendChild(element);
        }
        if(grid[x][y]) {
            $(jqGridId(x, y)).css("background-image", "url('images/"+grid[x][y]+".svg')");
        }
        getXYPosition(jqGridId(x, y), x, y);
    }
};

const randomRgb = (x, y) => Math.floor(Math.pow(Math.sin(2 + x * x + y * y * y + x / 10 - y / 10), 2) * 256) + "," + Math.floor(Math.pow(Math.sin(3 + x * x * y + y * y + x / 9 + y / 3), 2) * 256) + "," + Math.floor(Math.pow(Math.sin(2 + x * x * y * y - y * 2 + x / 22), 2) * 256) ;
const randomColor = (x, y, a) => a ? "rgba(" + randomRgb(x, y) + "," + Math.pow(Math.sin(1 + x / 2.1 + y * y / 7), 2) + ")" : "rgb(" + randomRgb(x, y) + ")";

const setGradient = (covers, x, y) => {
    var direction = ((x + y) % 2) ? "to left top" : "to right top";
    var x1 = ((x + y) % 2) ? x + 0.5 : (x - 0.5);
    var x2 = ((x + y) % 2) ? x - 0.5 : (x + 0.5);
    var y1 = y - 0.5;
    var y2 = y + 0.5;
    return "linear-gradient(" + direction + "," + randomColor(x1, y1, true) + "0%," + randomColor(x1, y1, false) + "7%," + randomColor(x2, y2, false) + "93%," + randomColor(x2, y2, true) + "100%)";
}

const makeCovers = (grid) => {
    var covers = new Array();
    var coversCreated = 0;
    for(var x = 0; x < config.width; x++) {
        covers[x] = new Array();
        for(var y = 0; y < config.height; y++) {
            var element = document.createElement("div");
            element.id = "cover" + coversCreated++
            document.body.appendChild(element);
            covers[x][y] = element;
            getXYPosition("#"+element.id, x, y);
            $("#"+element.id).css("background-image", setGradient(covers, x, y));
        }
    }
    return covers;
};

const makeGoals = () => {
    var goals = new Array();
    var goalsCreated = 0;
    for(var i = 1; i <= config.items; i++) {
        var element = document.createElement("div");
        element.id = "goal" + goalsCreated++
        document.body.appendChild(element);
        
        var y = i > 6 ? 1 : 0;
        var x = i > 6 ? i - 13 : i - 7;

        $("#"+element.id).css("left", "calc(100% - " + (-11 * x) +"vmin)");
        $("#"+element.id).css("top", (y + 0.25) * 11 + "vmin");
        $("#"+element.id).css("z-index", 3);
        $("#"+element.id).css("padding", "5px");
        $("#"+element.id).css("background-color", "rgba(0,15,0,0.95)");
        $("#"+element.id).css("background-image", "url('images/"+i+".svg')");
        goals[i] = element;
    }
    return goals;
};

const getPunushmentText = (punishment, element) => {
    if(Array.isArray(punishment))
        return punishment.map(p => getPunushmentText(p, element)).join(" + ");
    if(typeof punishment == 'number')
        element.dataset.number=punishment;
    else
        element.dataset.percentage=punishment.replace("%", '');
    return "" + punishment;
}

const makeCards = (goals) => {
    var cards = new Array();
    var numberOfDecks = 0;
    for(const taskDeck of taskDecks) {
        numberOfDecks++;
        var cardsCreated = 0;
        cards[numberOfDecks] = new Array();
        for(var subset = 0; subset < taskDeck.prizes.length; subset++)
        for(var i = 1; i <= taskDeck.items; i++) {
            var front = document.createElement("div");
            front.id = "card.front." + cardsCreated;
            front.style.backgroundImage = "url('images/front.svg')";
            front.style.width = "10.5vmin";
            front.style.height = "15.75vmin";
            front.style.display = "flex";
            front.style.justifyContent = "center";
            front.style.paddingTop = "3px";
            var clone = goals[i].cloneNode(true);
            clone.id = "card.front." + cardsCreated + "picture";
            clone.style.position = "absolute";
            clone.style.left = "0.75vmin";
            clone.style.top = "3.625vmin";
            clone.style.width = "9vmin";
            clone.style.height = "9vmin";
            clone.style.padding = "0px";
            front.appendChild(clone);
            var text = document.createTextNode(
                taskDeck.prizes[subset]
            );
            front.appendChild(text);
            front.classList.add("goal");
            front.style.visibility = "hidden";
            front.dataset.goal = i;
            front.dataset.prize = taskDeck.prizes[subset];
            document.body.appendChild(front);

            var back = document.createElement("div");
            back.id = "card.back." + cardsCreated;
            back.style.backgroundImage = "url('images/back" + numberOfDecks + ".svg')";
            back.style.width = "10.5vmin";
            back.style.height = "15.75vmin";
            document.body.appendChild(back);

            cards[numberOfDecks][cardsCreated++] = {
                front: front,
                back: back
            };
        }
    }

    var numberOfGoalCards = numberOfDecks;
    var numberOfPunishmentDecks = 0;
    for(const deck of punishmentDecks) {
        numberOfDecks++;
        numberOfPunishmentDecks++;
        var cardsCreated = 0;
        cards[numberOfDecks] = new Array();
        for(var punishment of deck) {
            var front = document.createElement("div");
            front.id = "card.front." + cardsCreated;
            front.style.backgroundImage = "url('images/front.svg')";
            front.style.width = "10.5vmin";
            front.style.height = "15.75vmin";
            front.classList.add("punishment");
            front.style.display = "flex";
            front.style.justifyContent = front.style.alignItems = "center";
            var text = document.createTextNode(
                getPunushmentText(punishment, front)
            );
            front.appendChild(text);
            front.style.visibility = "hidden";
            document.body.appendChild(front);

            var back = document.createElement("div");
            back.id = "card.back." + cardsCreated;
            back.style.backgroundImage = "url('images/back-" + numberOfPunishmentDecks + ".svg')";
            back.style.width = "10.5vmin";
            back.style.height = "15.75vmin";
            document.body.appendChild(back);

            cards[numberOfDecks][cardsCreated++] = {
                front: front,
                back: back
            };
        }
    }

    for(var deckNumber = 1; deckNumber <= numberOfGoalCards; deckNumber++) 
        shuffleCards(cards[deckNumber]);

    var specialPunishmentDeck = cards[numberOfGoalCards + 1];
    for(var i = 1; i <= config.items; i++) {
        specialPunishmentDeck[i-1].front.style.left = goals[i].style.left.replace(")", " - 2.5vmin)");
        specialPunishmentDeck[i-1].back.style.left = goals[i].style.left.replace(")", " - 2.5vmin)");
        specialPunishmentDeck[i-1].front.style.top = 'calc(' + goals[i].style.top + " - 2.5vmin)";
        specialPunishmentDeck[i-1].back.style.top = 'calc(' + goals[i].style.top + " - 2.5vmin)";
        specialPunishmentDeck[i-1].front.dataset.special = true;
        specialPunishmentDeck[i-1].back.dataset.special = true;
    }

    for(var deckNumber = numberOfGoalCards + 2; deckNumber <= numberOfDecks; deckNumber++) 
        shuffleCards(cards[deckNumber]);

    var orderedCards = {
        goals: new Array(),
        punishments: new Array(),
        specials: new Array()
    };

    var index = 0;
    for(var deckNumber = 1; deckNumber <= numberOfGoalCards; deckNumber++) 
    for(var card of cards[deckNumber])
        orderedCards.goals[index++] = card;

    index = 0;
    for(var card of specialPunishmentDeck)
        orderedCards.specials[index++] = card;
    
    var index = 0;
    for(var deckNumber = numberOfGoalCards + 2; deckNumber <= numberOfDecks; deckNumber++)
    for(var card of cards[deckNumber])
        orderedCards.punishments[index++] = card;

    var index = 0;
    for(var card of orderedCards.goals) {
        card.front.style.zIndex = card.back.style.zIndex = orderedCards.goals.length + 3 - (index);
        card.front.style.top = card.back.style.top = "calc(2vh + 5.5vmin + " + (index / 6) + "px)";
        card.front.style.left = card.back.style.left = (1.5 + index / 13.1) + "vw";
        index++;
    }

    var index = 0;
    for(var card of orderedCards.punishments) {
        card.front.style.zIndex = card.back.style.zIndex = orderedCards.goals.length + 3 - (index);
        card.front.style.top = card.back.style.top = "calc(2vh + 5.5vmin + " + (index / 6) + "px)";
        card.front.style.left = card.back.style.left = (12.5 + index / 13.1) +"vw";
        index++;
    }

    return orderedCards;
};


var grid = config.defaultGrid();

const addAllItems = () => {
    for(var i = 1; i <= 12; i++)
        addNewItem(grid, i);
}

const findClickables = (position, covers) => {
    for(var x = position[0] - 2; x <= position[0] + 2; x++)
    for(var y = position[1] - 2; y <= position[1] + 2; y++) {
        if((x == position[0] && y == position[1]) || covers[x] == null || covers[x][y] == null)
            continue;
        var active = Math.abs(x - position[0]) + Math.abs(y - position[1]) == 1;
        $("#" + covers[x][y].id).css("border-color", "blue");
        $("#" + covers[x][y].id).css("border-radius", "10px");
        $("#" + covers[x][y].id).css("border-style", "solid");
        $("#" + covers[x][y].id).css("border-width", active ? "5px" : "0px");
        $("#" + covers[x][y].id).css("left", active ? "calc("+getLeft(x)+" - 5px)" : getLeft(x));
        $("#" + covers[x][y].id).css("top", active ? "calc("+getTop(y)+" - 5px)" : getTop(y));
        $("#" + covers[x][y].id).prop("onclick", null).off("click");
        if(active) {
            var movedCover = covers[x][y];
            $("#" + movedCover.id).attr('data-x', x);
            $("#" + movedCover.id).attr('data-y', y);
            $("#" + movedCover.id).click(function(){
                $(this).css("border-width", active ? "5px" : "0px");
                $(this).animate({top: getTop(position[1]), left: getLeft(position[0])},
                    60, 
                    function(){
                        covers[position[0]][position[1]] = document.getElementById($(this).prop('id'));
                        position[0] = $(this).attr('data-x');
                        position[1] = $(this).attr('data-y');
                        findClickables(position, covers);
                    }
                );
            });
        } else {
            $("#" + covers[x][y].id).attr('data-x', null);
            $("#" + covers[x][y].id).attr('data-y', null);
        }
    }
};

const getCurrentGoal = (cards, goals) => {
    for(var card of cards.goals){
        if(card.front.dataset.used) continue;
        card.front.style.visibility = "visible";
        $(card.front).hide(11);
        $(card.front).show(611);
        $(card.back).hide(311);
        card.front.dataset.used = true;
        for(var i = 1; i<goals.length; i++) {
            goals[i].style.border = i == card.front.dataset.goal ? "solid blue 5px" : "0px";
            goals[i].style.padding = i == card.front.dataset.goal ? "0px" : "5px";
            goals[i].style.borderRadius = "3px";
        }
        return card.front.dataset.goal;
    }
};