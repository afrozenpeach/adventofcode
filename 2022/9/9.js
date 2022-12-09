const { count } = require('console');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'sample.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    var headSteps = data.split('\n').map(l => l.split(' '));

    var grid = [[{
        'tailVisited': true,
        'head': true,
        'tail': true
    }]];

    let currentHeadCoordinates = {
        'x': 0,
        'y': 0
    };

    let currentTailCoordinates = {
        'x': 0,
        'y': 0
    };


    drawGrid(grid);

    for (let hs of headSteps) {
        console.log(hs);

        switch(hs[0]) {
            case 'U':
                for (let i = 0; i < hs[1]; i++) {
                    grid[currentHeadCoordinates.y][currentHeadCoordinates.x].head = false;

                    if (currentHeadCoordinates.y === 0) {
                        grid[currentTailCoordinates.y][currentTailCoordinates.x].tail = false;
                        currentTailCoordinates.y++;

                        let line = [];

                        for (let j = 0; j < grid[currentHeadCoordinates.y].length; j++) {
                            line.push({
                                'tailVisited': false,
                                'head': false,
                                'tail': false
                            });
                        }

                        grid.unshift(line);
                        grid[currentTailCoordinates.y][currentTailCoordinates.x].tail = true;
                    } else {
                        currentHeadCoordinates.y--;
                    }

                    grid[currentHeadCoordinates.y][currentHeadCoordinates.x].head = true;

                    drawGrid(grid);
                    moveTail(currentHeadCoordinates, currentTailCoordinates, grid);
                    drawGrid(grid);
                }
                break;
            case 'D':
                for (let i = 0; i < hs[1]; i++) {
                    grid[currentHeadCoordinates.y][currentHeadCoordinates.x].head = false;

                    if (currentHeadCoordinates.y === grid.length - 1) {
                        let line = [];

                        for (let j = 0; j < grid[currentHeadCoordinates.y].length; j++) {
                            line.push({
                                'tailVisited': false,
                                'head': false,
                                'tail': false
                            });
                        }

                        grid.push(line);
                    }

                    grid[currentHeadCoordinates.y + 1][currentHeadCoordinates.x].head = true;
                    currentHeadCoordinates.y++;

                    drawGrid(grid);
                    moveTail(currentHeadCoordinates, currentTailCoordinates, grid);
                    drawGrid(grid);
                }
                break;
            case 'L':
                for (let i = 0; i < hs[1]; i++) {
                    grid[currentHeadCoordinates.y][currentHeadCoordinates.x].head = false;

                    if (currentHeadCoordinates.x === 0) {
                        grid[currentTailCoordinates.y][currentTailCoordinates.x].tail = false;
                        currentTailCoordinates.x++;

                        for (let j = 0; j < grid.length; j++) {
                            grid[j].unshift({
                                'tailVisited': false,
                                'head': false,
                                'tail': false
                            })
                        }

                        grid[currentHeadCoordinates.y][currentHeadCoordinates.x].head = true;
                        grid[currentTailCoordinates.y][currentTailCoordinates.x].tail = true;
                    } else {
                        grid[currentHeadCoordinates.y][currentHeadCoordinates.x - 1].head = true;
                        currentHeadCoordinates.x--;
                    }

                    drawGrid(grid);
                    moveTail(currentHeadCoordinates, currentTailCoordinates, grid);
                    drawGrid(grid);
                }
                break;
            case 'R':
                for (let i = 0; i < hs[1]; i++) {
                    grid[currentHeadCoordinates.y][currentHeadCoordinates.x].head = false;

                    if (currentHeadCoordinates.x === grid[currentHeadCoordinates.y].length - 1) {
                        for (let j = 0; j < grid.length; j++) {
                            grid[j].push({
                                'tailVisited': false,
                                'head': false,
                                'tail': false
                            });
                        }
                    }

                    grid[currentHeadCoordinates.y][currentHeadCoordinates.x + 1].head = true;
                    currentHeadCoordinates.x++;

                    drawGrid(grid);
                    moveTail(currentHeadCoordinates, currentTailCoordinates, grid);
                    drawGrid(grid);
                }
                break;
        }
    }

    countVisited(grid);
});

function moveTail(currentHeadCoordinates, currentTailCoordinates, grid) {
    grid[currentTailCoordinates.y][currentTailCoordinates.x].tail = false;

    if (currentHeadCoordinates.x === currentTailCoordinates.x + 2) {
        currentTailCoordinates.x++;
    } else if (currentHeadCoordinates.x === currentTailCoordinates.x - 2) {
        currentTailCoordinates.x--;
    } else if (currentHeadCoordinates.y === currentTailCoordinates.y + 2) {
        currentTailCoordinates.y++;
    } else if (currentHeadCoordinates.y === currentTailCoordinates.y - 2) {
        currentTailCoordinates.y--;
    } else if (!isAdjacent(currentHeadCoordinates, currentTailCoordinates) && (currentHeadCoordinates.x !== currentTailCoordinates.x || currentHeadCoordinates.y !== currentTailCoordinates.y)) {
        if (currentHeadCoordinates.x > currentTailCoordinates.x && currentHeadCoordinates.y > currentTailCoordinates.y) {
            currentTailCoordinates.x++;
            currentTailCoordinates.y++;
        } else if (currentHeadCoordinates.x > currentTailCoordinates.x && currentHeadCoordinates.y < currentTailCoordinates.y) {
            currentTailCoordinates.x++;
            currentTailCoordinates.y--;
        } else if (currentHeadCoordinates.x < currentTailCoordinates.x && currentHeadCoordinates.y > currentTailCoordinates.y) {
            currentTailCoordinates.x--;
            currentTailCoordinates.y++;
        } else if (currentHeadCoordinates.x < currentTailCoordinates.x && currentHeadCoordinates.y < currentTailCoordinates.y) {
            currentTailCoordinates.x--;
            currentTailCoordinates.y--;
        }
    }

    grid[currentTailCoordinates.y][currentTailCoordinates.x].tail = true;
    grid[currentTailCoordinates.y][currentTailCoordinates.x].tailVisited = true;
}

function isAdjacent(currentHeadCoordinates, currentTailCoordinates) {
    if (Math.abs(currentHeadCoordinates.x - currentTailCoordinates.x) > 1 ||
        Math.abs(currentHeadCoordinates.y - currentTailCoordinates.y) > 1) {
        return false;
    } else {
        return true;
    }
}

function drawGrid(grid) {
    for (let y of grid) {
        let line = '';
        for (let x of y) {
            let character = '.';

            if (x.head) {
                character = 'H';
            } else if (x.tail) {
                character = 'T';
            }

            line += character;
        }
        console.log(line);
    }

    console.log('------------');
}

function countVisited(grid) {
    let count = 0;

    for (let y of grid) {
        for (let x of y) {
            if (x.tailVisited) {
                count++;
            }
        }
    }

    console.log(count);
}