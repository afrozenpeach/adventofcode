const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '6.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    findUniqueMarker(data, 4);

    findUniqueMarker(data, 14);
});

function findUniqueMarker(data, length) {
    let marker = [];
    let count = 0;

    for (let c of data.split('')) {
        marker.push(c);
        count++;

        if (marker.length > length) {
            marker.shift();
        }

        if (marker.length === length) {
            let testMarker = marker.join('');
            let clean = true;

            for (let i = 0; i < testMarker.length; i++) {
                let split = testMarker.split(testMarker[i]);

                if (split.length > 2) {
                    clean = false;
                    break;
                }
            }

            if (clean) {
                console.log(marker.join(''));
                console.log(count);
                break;
            }
        }
    }
}