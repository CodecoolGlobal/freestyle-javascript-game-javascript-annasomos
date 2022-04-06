import {config} from'./config.js';

const game = {
    init : function() {
        this.gameField = document.querySelector('#game-field');
        this.difficulty = 'hard'
        this.initBlocks();
    },

    createBlock: function() {
        const col = Math.round(Math.random() * (config.cols - 1));
        //console.log(config.cols);
        //console.log(col);
        let field = getFieldByCoordinate({x: col, y: 0});
        const imgTag = document.createElement('img');

        imgTag.src = this.getRandomImageSource();
        imgTag.classList.add('hidden');
        field.appendChild(imgTag);
        field.classList.add('card');
        field.classList.add('current');

        this.fallTimerId = setInterval( () => {
            let currentField = document.querySelector('.game-field .row .field.card.current');
            const fieldBelow = getFieldBelow(currentField);

            moveCard(currentField, fieldBelow);

            currentField = document.querySelector('.game-field .row .field.card.current');
            if (isCardTouchedDown(currentField)) {
                console.log(this.fallTimerId)
                clearInterval(this.fallTimerId);
                currentField.classList.remove('current');
                game.createBlock();
            }
        }, config.fallSpeed[this.difficulty]);
        console.log(this.fallTimerId + ' set');
    },

    getRandomImageSource: function () {
        return config.memoryImageSources[Math.round(Math.random() * (config.memoryImageSources.length - 1))]
    },

    initBlocks: function() {
        this.setGameFieldSize();
        for (let row = 0; row < config.rows; row++) {
            const rowElement = this.addRow(this.gameField);
            for (let col = 0; col < config.cols; col++) {
                this.addCell(rowElement, row, col);
            }
        }
    },

    setGameFieldSize: function() {
        this.gameField.style.width = (this.gameField.dataset.cellWidth * config.cols) + 'px';
        this.gameField.style.height = (this.gameField.dataset.cellHeight * config.rows) + 'px';
    },

    addRow: function () {
        this.gameField.insertAdjacentHTML(
            'beforeend',
            '<div class="row"></div>'
        );
        return this.gameField.lastElementChild;
    },

    addCell: function (rowElement, row, col) {
        rowElement.insertAdjacentHTML(
            'beforeend',

            `<div class=" field"
                        data-row="${row}"
                        data-col="${col}"
                        >
                    </div>`);
    },

}

function getFieldByCoordinate(coordinate) {
    return document.querySelector(`div[data-row="${coordinate.y}"][data-col="${coordinate.x}"]`);
}

function getFieldBelow(field) {
    const col = parseInt(field.dataset.col);
    const row = parseInt(field.dataset.row) + 1;

    return getFieldByCoordinate({x: col, y: row});
}

function moveCard(sourceField, destinationField) {
    if (destinationField !== null && !(destinationField.classList.contains('card'))) {
        const imgTag = sourceField.querySelector('img');

        sourceField.classList.remove('card');
        sourceField.classList.remove('current');
        destinationField.classList.add('card');
        destinationField.classList.add('current');
        destinationField.appendChild(imgTag);
    }
}

function isCardTouchedDown(field) {
    const fieldBelow = getFieldBelow(field);
    //console.log('field:' + field.dataset.col + ', ' + field.dataset.row);

    return (fieldBelow === null || fieldBelow.classList.contains('card'));
}

game.init();
game.createBlock();