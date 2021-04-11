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

const setGradient = (covers, x, y) => "linear-gradient(to " +
    (((x + y) % 2) ? "left" : "rigt") + "top, rgba(" +
    Math.floor(Math.random() * 192) + "," + Math.floor(Math.random() * 192) + "," + Math.floor(Math.random() * 192) + "," + Math.random() +") 1%, rgb(" +
    Math.floor(Math.random() * 192) + "," + Math.floor(Math.random() * 192) + "," + Math.floor(Math.random() * 192) + ") 2%, ";

const makeCovers = () => {
    var covers = new Array();
    var coversCreated = 0;
    for(var x = 0; x < config.width; x++) {
        covers[x] = new Array();
        for(var y = 0; y < config.height; y++) {
            var element = document.createElement("div");
            element.id = "cover" + coversCreated++;
            document.body.appendChild(element);
            covers[x][y] = element;
            setXYPosition("#"+element.id, x, y);
            $(jqGridId(x, y)).css("background-image", setGradient(covers, x, y));
        }
    }
    return covers;
};


var grid = config.defaultGrid();
for(var i = 1; i <= 12; i++)
    addNewItem(grid, i);