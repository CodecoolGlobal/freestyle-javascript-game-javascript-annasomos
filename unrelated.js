const behavior = function (me) {
            function coordEquals(firstCoord, secondCoord) {
    return firstCoord[0] === secondCoord[0] && firstCoord[1] === secondCoord[1];
}

function getDistance(distanceTable, coord) {
    return distanceTable[coord[0]][coord[1]];
}

function setDistance(distanceTable, coord, distance) {
    distanceTable[coord[0]][coord[1]] = distance;
}

function createDistanceTable() {
    const table = new Array(map.getWidth());
    for(let x = 0; x < map.getWidth(); x++) {
        table[x] = new Array(10);
        for(let y = 0; y < 10; y++) {
            table[x][y] = Infinity;
        }
    }
    return table;
}

function calcDistances(startX, startY, destX, destY) {
    const distanceTable = createDistanceTable();
    const visited = [];
    const priorityQueue = {
        queue: [],

        addToQueue: function (destinationCoord, newCoord, distance) {
            let index = this.queue.length;

            while(index > 0 && distance < getDistance(distanceTable,
 this.queue[index - 1])) {
                index--;
            }

            this.queue.splice(index, 0, newCoord);
        },

        peekFirstElement: function () {
            return this.queue[0];
        },

        getFirstElement: function () {
            return this.queue.shift();
        },

        length: this.queue.length
    };

    setDistance(distanceTable, [startX, startY], 0);
    priorityQueue.addToQueue(distanceTable, [startX, startY]);

    while(priorityQueue.length > 0 && !coordEquals([destX, destY],
 priorityQueue.peekFirstElement())) {
        const element = priorityQueue.getFirstElement();
        visited.push(element);
        map.getAdjacentEmptyCells(element[0], element[1])
            .filter(neighbour => !visited.any(vis => coordEquals(vis,
 neighbour)))
            .forEach(neighbour => {
                setDistance(distanceTable, neighbour, getDistance(distanceTable,
 element) + 1);
                priorityQueue.addToQueue(neighbour);
            });
    }

    return distanceTable;
}

if (me.path === undefined) {
  me.key = [map.getWidth() - 2, 8]
  me.path = calcDistances(key[0], key[1], me.getX(), me.getY());
}

if (me.getX() !== key[0] && me.getY() !== key[1]) {
    me.move(
        map.getAdjacentEmptyCells(me.getX(), me.getY())
            .sort((first, second) => getDistance(path, first)
 < getDistance(path, second))[0][2]
    )
} else if (me.canMove('right')) {
	me.move('right');
} else {
    me.move('down');
}
        }
