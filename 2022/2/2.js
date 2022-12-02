const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '2.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    let games = data.split('\n').map(g => g.split(' '));

    games.map(g => {
        switch (g[1]) {
            case 'X':
                g[1] = 1;
                break;
            case 'Y':
                g[1] = 2;
                break;
            case 'Z':
                g[1] = 3;
                break;
        }

        switch (g[0]) {
            case 'A':
                g[0] = 1;
                break;
            case 'B':
                g[0] = 2;
                break;
            case 'C':
                g[0] = 3;
                break;
        }
    });

    games.map(g => {
        if (g[0] === g[1]) { //tie
            g[2] = 3;
        } else if (g[0] === 1 && g[1] === 2) { //rock vs paper -> win
            g[2] = 6;
        } else if (g[0] === 1 && g[1] === 3) { //rock vs scissors -> loss
            g[2] = 0;
        } else if (g[0] === 2 && g[1] === 1) { //paper vs rock -> loss
            g[2] = 0;
        } else if (g[0] === 2 && g[1] === 3) { //paper vs scissors -> win
            g[2] = 6;
        } else if (g[0] === 3 && g[1] === 1) { //scissors vs rock -> win
            g[2] = 6;
        } else if (g[0] === 3 && g[1] === 2) { //scissors vs paper -> loss
            g[2] = 0;
        }
    })

    console.log(games);

    let totalScore = 0;

    games.map(g => {
        totalScore += (g[1] + g[2]);
    });

    console.log(totalScore);
});