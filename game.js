function out(text) {
    document.getElementById('game').innerHTML = text;
}

function clear() {
    out('');
}

var EMPTY = 0;
var CAR = 1;

var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;

var MAP_HEIGHT = 10;
var MAP_WIDTH = 20;

var REFRESH_RATE = 100;

var map = [];

var delays = [];

var cars = [];

var finish = false;

var crash = false;

//            x                y
var person = [MAP_WIDTH >>> 1, 0];

function createWorld() {
    var x, y;

    for (y = 0; y < MAP_HEIGHT; y++) {
        if ( ! map[y] ) {
            map[y] = [];
        }

        for (x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = EMPTY;
        }
    }

    for (y = 0; y < MAP_HEIGHT; y++) {
        if ( y == 3 || y == 7 ) {
            delays[y] = 0;
        } else {
            delays[y] = Math.floor(Math.random() * 3000 + 100);
        }
        cars[y] = 0;
    }
}

function createCars() {
    var y;

    for (y = 1; y < MAP_HEIGHT - 1; y++) {
        cars[y] -= REFRESH_RATE;

        if ( cars[y] > 0 ) {
            continue;
        }

        map[y].pop();

        if ( Math.random() > 0.7) {
            map[y].unshift(CAR);
        } else {
            map[y].unshift(EMPTY);
        }

        cars[y] = delays[y];
    }
}

function draw() {
    var x, y, cols = '', row;

    for (y = MAP_HEIGHT - 1; y > -1; y--) {
        row = '';
        for (x = 0; x < MAP_WIDTH; x++) {
            var p = map[y][x];

            if ( person[1] == y && person[0] == x ) {
                row += '<i class="demo-icon icon-accessibility person">&#xe802;</i>';
            } else if ( p == CAR ) {
                row += '<i class="demo-icon icon-truck car">&#xe801;</i>';
            } else {
                row += '<i class="empty">&nbsp;</i>';
            }
        }
        cols += '<div class="road clearfix">' + row + "</div>";
    }

    out(cols);
}


function cycle() {
    clear();

    if ( map[person[1]][person[0]] == CAR ) {
        crash = true;
    }

    if ( person[1] == MAP_HEIGHT - 1 ) {
        finish = true;
    }

    if ( ! crash && ! finish ) {
        draw();
    } else if ( crash ) {
        out('CRASH');
    } else if (finish) {
        out('FINISH');
    }
}

function start() {
    createWorld();
    cycle();
}

setInterval(function() {
    cycle();
    createCars();
}, REFRESH_RATE);

document.addEventListener("keyup", function(event) {
    var keyCode = event.keyCode;

    if ( [UP, DOWN, LEFT, RIGHT].indexOf(keyCode) === -1 ) {
        return;
    }

    var personMove = [];

    if ( keyCode == UP ) {
        personMove = [0, 1];
    } else if ( keyCode == DOWN ) {
        personMove = [0, -1];
    } else if ( keyCode == LEFT ) {
        personMove = [-1, 0];
    } else {
        personMove = [1, 0];
    }

    var personNext = [person[0] + personMove[0], person[1] + personMove[1]];

    if ( personNext[0] < 0 || personNext[0] > MAP_WIDTH - 1 ) {

        return;
    }

    if ( personNext[1] < 0 || personNext[1] > MAP_HEIGHT - 1) {
        return;
    }

    if ( map[personNext[1]][personNext[0]] == CAR ) {
        crash = true;
    }

    if ( personNext[1] == MAP_WIDTH - 1 ) {
        finish = true;
    }

    person = personNext;
});

start();