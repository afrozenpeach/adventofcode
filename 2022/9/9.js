const { count } = require('console');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '9.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    var headSteps = data.split('\n').map(l => l.split(' '));
    knotMovement(headSteps, 2);
    knotMovement(headSteps, 10);
});

function knotMovement(headSteps, knotCount) {
    var grid = [[{
        'tailVisited': true
    }]];

    let knots = [];

    for (let i = 0; i < knotCount; i++) {
        knots.push({
            'x': 0,
            'y': 0,
            'num': i
        });
    }

    let currentHeadCoordinates = knots[0];

    let currentTailCoordinates = knots[knotCount - 1];

    for (let hs of headSteps) {
        switch(hs[0]) {
            case 'U':
                for (let i = 0; i < Number(hs[1]); i++) {
                    if (currentHeadCoordinates.y === 0) {
                        for (let j = 1; j < knots.length; j++) {
                            knots[j].y++;
                        }

                        let line = [];

                        for (let j = 0; j < grid[currentHeadCoordinates.y].length; j++) {
                            line.push({
                                'tailVisited': false
                            });
                        }

                        grid.unshift(line);
                    } else {
                        currentHeadCoordinates.y--;
                    }

                    for (let i = 1; i < knotCount; i++) {
                        moveNextKnot(knots[i-1], knots[i]);
                    }

                    grid[currentTailCoordinates.y][currentTailCoordinates.x].tailVisited = true;
                }
                break;
            case 'D':
                for (let i = 0; i < hs[1]; i++) {
                    if (currentHeadCoordinates.y === grid.length - 1) {
                        let line = [];

                        for (let j = 0; j < grid[currentHeadCoordinates.y].length; j++) {
                            line.push({
                                'tailVisited': false
                            });
                        }

                        grid.push(line);
                    }

                    currentHeadCoordinates.y++;

                    for (let i = 1; i < knotCount; i++) {
                        moveNextKnot(knots[i-1], knots[i]);
                    }

                    grid[currentTailCoordinates.y][currentTailCoordinates.x].tailVisited = true;
                }
                break;
            case 'L':
                for (let i = 0; i < hs[1]; i++) {
                    if (currentHeadCoordinates.x === 0) {
                        for (let j = 1; j < knots.length; j++) {
                            knots[j].x++;
                        }

                        for (let j = 0; j < grid.length; j++) {
                            grid[j].unshift({
                                'tailVisited': false
                            })
                        }
                    } else {
                        currentHeadCoordinates.x--;
                    }

                    for (let i = 1; i < knotCount; i++) {
                        moveNextKnot(knots[i-1], knots[i]);
                    }

                    grid[currentTailCoordinates.y][currentTailCoordinates.x].tailVisited = true;
                }
                break;
            case 'R':
                for (let i = 0; i < hs[1]; i++) {
                    if (currentHeadCoordinates.x === grid[currentHeadCoordinates.y].length - 1) {
                        for (let j = 0; j < grid.length; j++) {
                            grid[j].push({
                                'tailVisited': false
                            });
                        }
                    }

                    currentHeadCoordinates.x++;

                    for (let i = 1; i < knotCount; i++) {
                        moveNextKnot(knots[i-1], knots[i]);
                    }

                    grid[currentTailCoordinates.y][currentTailCoordinates.x].tailVisited = true;
                }
                break;
        }
    }

    countVisited(grid);
}

function moveNextKnot(prevKnot, nextKnot) {
    if (prevKnot.x === nextKnot.x + 2 && prevKnot.y === nextKnot.y) {
        nextKnot.x++;
    } else if (prevKnot.x === nextKnot.x - 2 && prevKnot.y === nextKnot.y) {
        nextKnot.x--;
    } else if (prevKnot.y === nextKnot.y + 2 && prevKnot.x === nextKnot.x) {
        nextKnot.y++;
    } else if (prevKnot.y === nextKnot.y - 2 && prevKnot.x === nextKnot.x) {
        nextKnot.y--;
    } else if (!isAdjacent(prevKnot, nextKnot) && (prevKnot.x !== nextKnot.x || prevKnot.y !== nextKnot.y)) {
        if (prevKnot.x > nextKnot.x && prevKnot.y > nextKnot.y) {
            nextKnot.x++;
            nextKnot.y++;
        } else if (prevKnot.x > nextKnot.x && prevKnot.y < nextKnot.y) {
            nextKnot.x++;
            nextKnot.y--;
        } else if (prevKnot.x < nextKnot.x && prevKnot.y > nextKnot.y) {
            nextKnot.x--;
            nextKnot.y++;
        } else if (prevKnot.x < nextKnot.x && prevKnot.y < nextKnot.y) {
            nextKnot.x--;
            nextKnot.y--;
        }
    }
}

function isAdjacent(prevKnot, nextKnot) {
    if (Math.abs(prevKnot.x - nextKnot.x) > 1 ||
        Math.abs(prevKnot.y - nextKnot.y) > 1) {
        return false;
    } else {
        return true;
    }
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