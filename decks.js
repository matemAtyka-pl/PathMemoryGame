const taskDecks = [{
    items: 10,
    prizes: [1000, 1500],
    punishmentFactor: [1, 2]
}, {
    items: 11,
    prizes: [5000, 7000],
    punishmentFactor: [2, 3]
}, {
    items: 12,
    prizes: [10000, 15000, 20000],
    punishmentFactor: [5, 8, 10]
}];

const punishmentDecks = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 2, 5, 7, 10, "1%", 20, [10, "1%"], "2%", ["2%", 20], "5%", 49, 99],
    [50, 55, 60, 70, 75, 80, 90, 99, 100, "10%", 121, 199, 1000, "20%", 3000],
    ["15%", 5000, "30%", 9000, "90%", "99%"]
];

function shuffleCards(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}