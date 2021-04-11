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

const setXYPosition = (jqName, x, y) => {
    $(jqName).css("left", (1 + 11 * x) + "vmin");
    $(jqName).css("top", (89 - 11 * y) + "vmin");
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
            $(jqGridId(x, y)).css("background-image", "url('colorsymbolswheel.svg')");
        }
        setXYPosition(jqGridId(x, y), x, y);
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
            setXYPosition("#"+element.id, x, y);
            $("#"+element.id).css("background-image", setGradient(covers, x, y));
        }
    }
    return covers;
};


var grid = config.defaultGrid();

const addAllItems = () => {
    for(var i = 1; i <= 12; i++)
        addNewItem(grid, i);
}