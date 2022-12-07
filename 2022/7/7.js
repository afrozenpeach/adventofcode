const { dir } = require('console');
const fs = require('fs');
const { totalmem } = require('os');
const path = require('path');
const { exit } = require('process');
const filePath = path.join(__dirname, '7.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    let lines = data.split('\n').map(l => l.split(' '));

    let directoryStructure = [{
        'name': '/',
        'contents': [],
        'parent': null,
        'size': 0
    }];
    let currentDirectory = null;

    for (const l of lines) {
        try {
            if (l.length === 0) {
                continue;
            }

            switch (l[0]) {
                case '$':
                    if (l[1] === 'cd') {
                        if (l[2] === '/') {
                            currentDirectory = directoryStructure[0];
                        } else if (l[2] === '..') {
                            currentDirectory = currentDirectory.parent;
                        } else {
                            currentDirectory = currentDirectory.contents.filter(d => d.name === l[2])[0];
                        }
                    }
                    break;
                case 'ls':
                    break;
                case 'dir':
                    currentDirectory.contents.push({
                        'name': l[1],
                        'contents': [],
                        'parent': currentDirectory,
                        'size': 0
                    });
                    break;
                default: //It's a file size
                    currentDirectory.contents.push({
                        'name': l[1],
                        'contents': null,
                        'parent': currentDirectory,
                        'size': Number(l[0])
                    });

                    currentDirectory.size += Number(l[0])
                    increaseParent(currentDirectory.parent, Number(l[0]));
                    break;
            }
        } catch (ex) {
            console.log(ex);
            break;
        }
    }

    let currentMaxSizes = [];

    maxSize(directoryStructure[0], 100000, currentMaxSizes);

    let sum = 0;
    for (const d of currentMaxSizes) {
        sum += d.size;
    }

    console.log(sum);
});


function increaseParent(parent, size) {
    parent.size += size;
    if (parent.parent !== null) {
        increaseParent(parent.parent, size);
    }
}

function maxSize(dir, size, currentMaxSizes) {
    if (dir.contents !== null) {
        if (dir.size <= size) {
            currentMaxSizes.push(dir);
        }

        for (const d of dir.contents) {
            maxSize(d, size, currentMaxSizes);
        }
    }

}