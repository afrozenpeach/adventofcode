const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '8.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    let grid = data.split('\n').map(l => l.split('').map(t => Number(t)));

    //Remove new line
    grid.pop();

    let countVisible = 0;
    let countInvisible = 0;

    for (let x = 0; x < grid[0].length; x++) {
        for (let y = 0; y < grid.length; y++) {
            if (isVisible(grid, x, y)) {
                countVisible++;
            } else {
                countInvisible++;
            }
        }
    }

    console.log(countVisible);
});

function isVisible(grid, x, y) {
    //Edge cases
    if (x === 0 || x === grid[y].length - 1 || y === 0 || y === grid.length - 1) {
        return true;
    }

    //left right up and down
    let left = getLeft(grid, x, y);

    if (!left.filter(t => t >= grid[y][x]).length > 0) {
        return true;
    }

    let right = getRight(grid, x, y);

    if (!right.filter(t => t >= grid[y][x]).length > 0) {
        return true;
    }

    let up = getUp(grid, x, y);

    if (!up.filter(t => t >= grid[y][x]).length > 0) {
        return true;
    }

    let down = getDown(grid, x, y);

    if (!down.filter(t => t >= grid[y][x]).length > 0) {
        return true;
    }

    return false;
}

function scenicScore(grid, x, y) {

}

function getLeft(grid, x, y) {
    let clonedGrid = structuredClone(grid);

    return clonedGrid[y].splice(0, x)
}

function getRight(grid, x, y) {
    let clonedGrid = structuredClone(grid);

    return clonedGrid[y].splice(x + 1)
}

function getUp(grid, x, y) {
    let up = [];

    for (let i = 0; i < y; i++) {
        up.push(grid[i][x]);
    }

    return up;
}

function getDown(grid, x, y) {
    let down = [];

    for (let i = y + 1; i < grid[0].length; i++) {
        down.push(grid[i][x]);
    }

    return down;
}