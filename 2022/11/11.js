const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '11.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    let monkies = data.split('\n\n').map(m => {
        let monkeyLines = m.split('\n');

        return {
            'id': Number(monkeyLines[0].split(' ')[1][0]),
            'items': monkeyLines[1].split(': ')[1].split(', ').map(i => Number(i)),
            'operation': monkeyLines[2].split(' ')[6],
            'operationValue': Number(monkeyLines[2].split(' ')[7]),
            'test': {
                'divisibleBy': Number(monkeyLines[3].split(' by ')[1]),
                'ifTrue': Number(monkeyLines[4].split(' monkey ')[1]),
                'ifFalse': Number(monkeyLines[5].split(' monkey ')[1])
            },
            'inspectionCount': 0
        }
    });

    let monkeyBusiness = monkeyRounds(structuredClone(monkies), 20, 3);

    console.log(monkeyBusiness);

    let monkeyBusiness2 = monkeyRounds(structuredClone(monkies), 10000, 1);

    console.log(monkeyBusiness2);
});

function monkeyRounds(monkies, rounds, worryDivider) {
    for (let i = 0, currentMonkeyId = 0; i < rounds;) {
        let currentMonkey = monkies.find(m => m.id === currentMonkeyId);

        while (currentMonkey.items.length > 0)
        {
            let currentItem = currentMonkey.items.shift();
            let operationValue = isNaN(currentMonkey.operationValue) ? currentItem : currentMonkey.operationValue;

            //Monkey inspects item
            currentMonkey.inspectionCount++;

            switch (currentMonkey.operation)
            {
                case '+':
                    currentItem += operationValue;
                    break;
                case '*':
                    currentItem *= operationValue;
                    break;
            }

            //Monkey gets bored with item
            currentItem = Math.floor(currentItem / worryDivider);

            //Monkey throws item
            let monkeyToThrow = undefined;
            if (currentItem % currentMonkey.test.divisibleBy === 0) {
                monkeyToThrow = monkies.find(m => m.id === currentMonkey.test.ifTrue);
            } else {
                monkeyToThrow = monkies.find(m => m.id === currentMonkey.test.ifFalse);
            }

            monkeyToThrow.items.push(currentItem);
        }

        currentMonkeyId++;

        if (currentMonkeyId >= monkies.length) {
            currentMonkeyId = 0;
            i++;
        }
    }

    monkies.sort((a, b) => {
        if (a.inspectionCount > b.inspectionCount) {
            return 1;
        } else if (a.inspectionCount < b.inspectionCount) {
            return -1;
        } else {
            return 0;
        }
    }).reverse();

    return monkies[0].inspectionCount * monkies[1].inspectionCount;
}