const { group } = require('console');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '3.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    //Create and organize rucksacks
    let rucksacks = data.split('\n').map(r => {
        var half = r.length / 2;

        return [
            r.substring(0, half).split(''),
            r.substring(half).split('')
        ];
    });

    console.log(rucksacks);

    //Find item in both compartments
    let itemInTwoCompartments = rucksacks.map(r => {
        uniqueC1 = [...new Set(r[0])];
        uniqueC2 = [...new Set(r[1])];

        return uniqueC1.map(i => {
            if (uniqueC2.includes(i)) {
                return i;
            } else {
                return 0;
            }
        }).filter(i => i !== 0);
    }).map(i => i[0]);

    console.log(itemInTwoCompartments);

    //Swap case and set numeric value
    let priorityValues = itemInTwoCompartments.map(i => {
        return i === i.toUpperCase() ? i.toLowerCase().charCodeAt(0) - 70 : i.toUpperCase().charCodeAt(0) - 64;
    });

    console.log(priorityValues);

    //Sum priorities
    let sum = 0;
    priorityValues.map(v => sum += v);

    console.log(sum);
});