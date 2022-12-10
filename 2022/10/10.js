const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '10.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    var commands = data.split('\n').map(c => {
        command = c.split(' ');

        return {
            'command': command[0],
            'value': Number(command[1])
        }
    });

    let cycles = 1;
    let x = 1;
    let sumChecks = 0;
    let commandIndex = 0;
    let skipCycle = false;

    let cycleChecks = [20, 60, 100, 140, 180, 220];

    while (true) {
        let currentCommand = commands[commandIndex];
        switch (currentCommand.command) {
            case 'addx':
                if (skipCycle) {
                    x += currentCommand.value;
                    commandIndex++;
                    skipCycle = false;
                } else {
                    skipCycle = true;
                }
                break;
            case 'noop':
                commandIndex++;
                break;
        }

        if (cycleChecks.includes(cycles)) {
            sumChecks += (cycles * x);
            cycleChecks.shift();

            if (cycleChecks.length === 0) {
                break;
            }
        }

        cycles++;
    }

    console.log(sumChecks);
});