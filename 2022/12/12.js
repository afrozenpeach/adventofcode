const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '12.txt');

let lowest = 10000;

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    var grid = data.split('\n').map(l => l.split(''));
    grid.pop(); //new line

    let currentPosition = findPosition(grid, 'S');
    let endPosition = findPosition(grid, 'E');
    let decisions = [];
    let complete = false;
    let uniqueSteps = new Set();

    do {
        do {
            complete = walk(grid, currentPosition, endPosition, decisions);

            if (complete.decisionsMade.length > 0) {
                decisions.push(complete.decisionsMade.pop());
            }

            drawGrid(complete.grid);
            console.log(lowest);
        } while (complete.brokenStepFound && !complete.endFound);

        //We completed a run
        if (complete.endFound) {
            console.log(complete.steps);
            uniqueSteps.add(complete.steps);

            if (complete.decisionsMade.length > 0) {
                decisions.push(complete.decisionsMade.pop());
            }

            if (lowest > complete.steps) {
                lowest = complete.steps;
            }
            console.log(lowest);
        }
    } while (complete.decisionsMade.length > 0);

    let uniqueStepsArray = Array.from(uniqueSteps);
    uniqueStepsArray.sort((a, b) => {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        } else {
            return 0;
        }
    });

    console.log(uniqueStepsArray.shift());
});

function walk(grid, currentPosition, endPosition, decisions) {
    let clonedGrid = structuredClone(grid);
    let brokenStepFound = false;
    let lastPosition = null;
    let steps = 0;
    let allPositionsChecked = false;
    let decisionsMade = [];
    let endFound = false;

    do {
        let nextGoal = findNearestNextElevation(clonedGrid, currentPosition);

        let nextPositions = possibleNextPositions(clonedGrid, currentPosition, decisions, steps)
            .sort((a, b) => {
                if (getDistance(a, nextGoal) > getDistance(b, nextGoal)) {
                    return 1;
                } else if (getDistance(a, nextGoal) < getDistance(b, nextGoal)) {
                    return -1;
                } else {
                    if (getDistance(a, endPosition) > getDistance(b, endPosition)) {
                        return 1;
                    } else if (getDistance(a, endPosition) < getDistance(b, endPosition)) {
                        return -1;
                    } else {
                        return Math.floor((Math.random() * 3)) - 2;
                    }
                }
            });

        lastPosition = currentPosition;
        currentPosition = nextPositions.shift();
        if (currentPosition === undefined) {
            brokenStepFound = true;
            break;
        }

        if (nextPositions.length > 0) {
            decisionsMade.push({
                'x': lastPosition.x,
                'y': lastPosition.y,
                'direction': currentPosition.direction,
                'step': steps + 1
            });
        }

        steps++;
        if (steps > lowest) {
            brokenStepFound = true;
            break;
        }
        clonedGrid[lastPosition.y][lastPosition.x] = currentPosition.direction;

        if (endPosition.x === currentPosition.x && endPosition.y == currentPosition.y) {
            endFound = true;
        }
    } while (!endFound);

    return {
        'brokenStepFound': brokenStepFound,
        'steps': steps,
        'allPositionsChecked': allPositionsChecked,
        'decisionsMade': decisionsMade,
        'endFound': endFound,
        'grid': clonedGrid
    };
}

function findPosition(grid, posCharacter) {
    let x = grid.find(l => l.includes(posCharacter)).findIndex(x => x === posCharacter);
    let y = grid.findIndex(l => l.includes(posCharacter));

    return {
        'x': x,
        'y': y,
    }
}

function possibleNextPositions(grid, currentPosition, decisions, steps) {
    let positions = [];
    let currentElevationChar = grid[currentPosition.y][currentPosition.x];

    if (currentElevationChar === 'S') {
        currentElevationChar = 'a';
    }

    let currentElevation = currentElevationChar.charCodeAt(0);
    let nextMaximumElevation = currentElevation + 1;
    let endElevation = 'z'.charCodeAt(0);

    //Up
    if (currentPosition.y - 1 >= 0 && grid[currentPosition.y - 1][currentPosition.x].charCodeAt(0) <= nextMaximumElevation)
    {
        positions.push({
            'x': currentPosition.x,
            'y': currentPosition.y - 1,
            'direction': '^',
            'elevation': grid[currentPosition.y - 1][currentPosition.x].charCodeAt(0)
        })
    }

    //Down
    if (currentPosition.y + 1 < grid.length && grid[currentPosition.y + 1][currentPosition.x].charCodeAt(0) <= nextMaximumElevation) {
        positions.push({
            'x': currentPosition.x,
            'y': currentPosition.y + 1,
            'direction': 'V',
            'elevation': grid[currentPosition.y + 1][currentPosition.x].charCodeAt(0)
        })
    }

    //Left
    if (currentPosition.x - 1 >= 0 && grid[currentPosition.y][currentPosition.x - 1].charCodeAt(0) <= nextMaximumElevation) {
        positions.push({
            'x': currentPosition.x - 1,
            'y': currentPosition.y,
            'direction': '<',
            'elevation': grid[currentPosition.y][currentPosition.x - 1].charCodeAt(0)
        })
    }

    //Right
    if (currentPosition.x + 1 < grid[currentPosition.y].length && grid[currentPosition.y][currentPosition.x + 1].charCodeAt(0) <= nextMaximumElevation) {
        positions.push({
            'x': currentPosition.x + 1,
            'y': currentPosition.y,
            'direction': '>',
            'elevation': grid[currentPosition.y][currentPosition.x + 1].charCodeAt(0)
        })
    }

    //can we end the run?
    if (nextMaximumElevation >= endElevation) {
        let finalPosition = positions.filter(p => grid[p.y][p.x] === 'E');

        if (finalPosition.length > 0) {
            return finalPosition;
        }
    }

    //filter previous decisions
    positions = positions.filter(p => {
        let d = decisions.filter(d => currentPosition.x === d.x && currentPosition.y === d.y && p.direction === d.direction)

        if (d.length > 0) {
            return false;
        }

        return true;
    });

    //filter positions we've been to
    positions = positions.filter(p => grid[p.y][p.x] >= 'a' && grid[p.y][p.x] <= 'z');

    return positions;
}

function getDistance(c1, c2) {
    return Math.abs(Math.hypot(c2.x-c1.x, c2.y-c1.y));
}

function drawGrid(grid) {
    let clondedGrid = structuredClone(grid);

    for (let l of clondedGrid) {
        let line = '';

        for (let p of l) {
            line += p;
        }

        console.log(line);
    }

    console.log('');
}

function findNearestNextElevation(grid, currentPosition) {
    let smallestDistance = Infinity;
    let nextGoal = undefined;
    let currentElevationChar = grid[currentPosition.y][currentPosition.x];

    if (currentElevationChar === 'S') {
        currentElevationChar = 'a';
    }

    let currentElevation = currentElevationChar.charCodeAt(0);
    let goalMaximumElevation = 'z'.charCodeAt(0);
    let nextMaximumElevation = currentElevation + 1;

    if (nextMaximumElevation > goalMaximumElevation) {
        nextMaximumElevation = goalMaximumElevation;
    }

    for (let y in grid) {
        for (let x in grid[y]) {
            let elevationChar = grid[y][x];

            if (elevationChar === 'S') {
                elevationChar = 'a';
            } else if (elevationChar === 'E') {
                elevationChar = 'z';
            }

            let elevation = grid[y][x].charCodeAt(0);

            if (elevation === nextMaximumElevation) {
                let distance = getDistance(currentPosition, {
                    'x': x,
                    'y': y
                });

                if (smallestDistance > distance) {
                    smallestDistance = distance;
                    nextGoal = {
                        'x': x,
                        'y': y
                    }
                }
            }
        }
    }

    return nextGoal;
}