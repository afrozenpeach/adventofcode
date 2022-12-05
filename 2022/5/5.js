const { group } = require('console');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '5.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    let input = data.split('\n\n').map(l => l.split('\n'));
    let cargo = input[0]
                    .map(l => l.match(/([ \[\]A-Z1-9]{2,4})/g)
                    .map(m => m.trim()));;
    let crainActions = input[1]
                            .map(a => a.split('move ').map(i => i.split(' from ').map(j => j.split(' to '))))
                            .map(a => {
                                return {
                                    'crateCount': Number(a[1][0][0]),
                                    'fromStack': Number(a[1][1][0]) - 1,
                                    'toStack': Number(a[1][1][1]) - 1
                                }
                            });

    let stacks = cargo.map(c => []);

    //create stacks from cargo
    for (let c of cargo) {
        for (let i = 0; i < c.length; i++) {
            if (c[i] !== '') {
                stacks[i].push(c[i][1]);
            }
        }
    }

    //Remove numbers
    for (let s of stacks) {
        s.pop();
    }

    //clone for part 2
    let stacksPart2 = JSON.parse(JSON.stringify(stacks));

    //start taking actions
    for (let a of crainActions) {
        let fromStack = stacks[a.fromStack];
        let toStack = stacks[a.toStack];

        for (let i = 0; i < a.crateCount; i++) {
            toStack.unshift(fromStack.shift());
        }
    }

    let topOfStacks = stacks.map(s => s.shift());
    console.log(topOfStacks);

    for (let a of crainActions) {
        let fromStack = stacksPart2[a.fromStack];
        let toStack = stacksPart2[a.toStack];

        let crates = fromStack.splice(0, a.crateCount);
        toStack.unshift(...crates);
    }

    let topOfStacksPart2 = stacksPart2.map(s => s.shift());
    console.log(topOfStacksPart2);
});