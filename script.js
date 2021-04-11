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
            $(jqGridId(x, y)).css("background-image", "url('colorsymbolswheel.svg')");
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
}
