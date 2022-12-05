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
                    .map(l => l.match(/([ \[\]A-Z1-9]{3,4})/g)
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
});