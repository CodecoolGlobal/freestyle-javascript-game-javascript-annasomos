import './config.js';

const game = {
    init : function() {
        this.gameField = document.querySelector('#game-field');
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

    playerMoveBlock: function () {
        const card = document.querySelector('.game-field .row .field.card.current');
        card.addEventListener('keydown', function (event) {
            let newCoordinate;
            let targetField;
            switch (event.key) {
                case "ArrowLeft":
                case "A":
                    newCoordinate = {x: card.dataset.col - 1, y: card.dataset.row};
                    break;
                case "ArrowRight":
                case "D":
                    newCoordinate = {x: card.dataset.col + 1, y: card.dataset.row};
                    break;
                case "ArrowDown":
                case "S":
                    newCoordinate = {x: card.dataset.col, y: card.dataset.row + 1};
                    break;
            }
            targetField = getFieldByCoordinate(newCoordinate);
            // moveCard(card, targetField);
        })
    },

}

function getFieldByCoordinate(coordinate) {
    return document.querySelector(`div[data-row="${coordinate.y}"][data-col="${coordinate.x}"`);
}

game.init();