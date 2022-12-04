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
        let uniqueC1 = [...new Set(r[0])];
        let uniqueC2 = [...new Set(r[1])];

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

    //part 2
    let rucksacksPart2 = data.split('\n');
    let groupedRucksacks = [];

    //Group rucksacks
    for (let i = 0; i < rucksacksPart2.length; i+=3) {
        groupedRucksacks.push(rucksacksPart2.slice(i, i + 3))
    }

    console.log(groupedRucksacks);

    let itemInThreeRucksacks = groupedRucksacks.map(g => {
        let uniqueC1 = [...new Set(g[0].split(''))];
        let uniqueC2 = [...new Set(g[1].split(''))];
        let uniqueC3 = [...new Set(g[2].split(''))];

        return uniqueC1.map(i => {
            if (uniqueC2.includes(i) && uniqueC3.includes(i)) {
                return i;
            } else {
                return 0;
            }
        }).filter(i => i !== 0);
    }).map(i => i[0]);

    console.log(itemInThreeRucksacks);

    //Swap case and set numeric value
    let priorityValuesPart2 = itemInThreeRucksacks.map(i => {
        return i === i.toUpperCase() ? i.toLowerCase().charCodeAt(0) - 70 : i.toUpperCase().charCodeAt(0) - 64;
    });

    console.log(priorityValuesPart2);

    //Sum priorities
    let sumPart2 = 0;
    priorityValuesPart2.map(v => sumPart2 += v);

    console.log(sumPart2);
});