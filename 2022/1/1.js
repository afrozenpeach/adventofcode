const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '1.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    let elves = parseCalories(data);
    let top3 = [];

    console.log(findMostCalories(elves).calories);

    for (let i = 0; i < 3; i++) {
        let index = elves.indexOf(findMostCalories(elves).elf);

        top3.push(elves[index]);

        elves.splice(index, 1);
    }

    let sumTop3 = 0;

    for (const elf of top3) {
        sumTop3 += elf.totalCalories
    }

    console.log(sumTop3);
});

function parseCalories(data) {
    let elves = [];

    for (const elf of data.split('\n\n')) {
        elves.push(parseElf(elf));
    }

    return elves;
}

function parseElf(elf) {
    let meals = [];
    let totalCalories = 0;

    for (const meal of elf.split('\n')) {
        meals.push(meal);
        totalCalories += Number(meal);
    }

    return {
        'meals': meals,
        'totalCalories': totalCalories
    };
}

function findMostCalories(elves) {
    let mostCalories = 0;
    let elfWithMostCalories = null;

    for (const elf of elves) {
        if (elf.totalCalories > mostCalories) {
            elfWithMostCalories = elf;
            mostCalories = elf.totalCalories;
        }
    }

    return {
        "elf": elfWithMostCalories,
        "calories": mostCalories
    };
}