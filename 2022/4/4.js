const { group } = require('console');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '4.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    let pairs = data.split('\n').map(p => p.split(',').map(e => e.split('-').map(n => Number(n))));

    console.log(pairs);

    let encompassedPairs = pairs.map(p => {
        if (p[0][0] <= p[1][0] && p[0][1] >= p[1][1]) { //Elf 1 encompasses Elf 2
            return p;
        } else if (p[1][0] <= p[0][0] && p[1][1] >= p[0][1]) { //Elf 2 encompasses Elf 1
            return p;
        } else {
            return 0;
        }
    }).filter(p => p !== 0);

    console.log(encompassedPairs.length);
});