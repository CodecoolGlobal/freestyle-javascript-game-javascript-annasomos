import {config} from'./config.js';

const game = {
    init : function() {
        this.gameField = document.querySelector('#game-field');
        this.difficulty = 'easy'
        this.initBlocks();
    },

    createBlock: function() {
        const col = Math.round(Math.random() * config.cols);
        const field = getFieldByCoordinate({x: col, y: 0});
        const imgTag = document.createElement('img');

        imgTag.src = this.getRandomImageSource();
        imgTag.classList.add('hidden');
        field.appendChild(imgTag);
        field.classList.add('card');

        const fallTimerId = setInterval(function () {
            const fieldBelow = getFieldByCoordinate({
                x: field.dataset.col,
                y: field.dataset.row + 1
            });

            moveCard(field, fieldBelow);

            if (isCardTouchedDown(field)) {
                clearInterval(fallTimerId);
            }
        }, config.fallSpeed[this.difficulty]);
    },

    getRandomImageSource: function () {
        return config.memoryImageSources[Math.round(Math.random() * config.memoryImageSources.length)]
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
    return document.querySelector(`div[data-row="${coordinate.y}"][data-col="${coordinate.x}"`);
}

function moveCard(sourceField, destinationField) {
    if (destinationField && !('card' in destinationField.classList)) {
        const imgTag = sourceField.querySelector('img');

        sourceField.classList.remove('card');
        destinationField.classList.add('card');
        destinationField.appendChild(imgTag);
    }
}

function isCardTouchedDown(field) {
    const fieldBelow = getFieldByCoordinate({
                x: field.dataset.col,
                y: field.dataset.row + 1
            });

    return !(fieldBelow && 'card' in fieldBelow.classList);
}

game.init();