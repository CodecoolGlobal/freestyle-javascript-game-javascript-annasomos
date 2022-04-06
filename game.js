import {config} from './config.js';


const game = {
    init : function() {
        this.gameField = document.querySelector('#game-field');
        this.difficulty = 'hard'
        this.initBlocks();
        this.createCard();
        this.playerMoveBlock();
    },

    createCard: function() {
        const imgTag = this.getRandomImageTag()
        const card = this.createRandomCardTag(imgTag);

        this.fallTimerId = setInterval( () => {
            let currentField = document.querySelector('.game-field .row .field.card.current');
            const fieldBelow = getFieldBelow(currentField);

            moveCard(currentField, fieldBelow);

            currentField = document.querySelector('.game-field .row .field.card.current');
            if (isCardTouchedDown(currentField)) {
                clearInterval(this.fallTimerId);
                currentField.classList.remove('current');
                game.createCard();
            }
        }, config.fallSpeed[this.difficulty]);
    },

    getRandomImageTag: function () {
        const imgTag = document.createElement('img');
        imgTag.src = config.memoryImageSources[Math.round(Math.random() * (config.memoryImageSources.length - 1))];
        imgTag.classList.add('hidden');

        return imgTag;
    },

    createRandomCardTag: function (imgTag) {
        const col = Math.round(Math.random() * (config.cols - 1));
        const card = getFieldByCoordinate({x: col, y: 0});
        card.classList.add('card');
        card.classList.add('current');
        card.appendChild(imgTag);
        return card;
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
        document.addEventListener('keydown', function (event) {
            let card = document.querySelector('.game-field .row .field.card.current');
            let newCoordinate;
            let targetField;
            console.log(event.key);
            switch (event.key) {
                case "ArrowLeft":
                case "A":
                    newCoordinate = {x: parseInt(card.dataset.col) - 1, y: card.dataset.row};
                    break;
                case "ArrowRight":
                case "D":
                    newCoordinate = {x: parseInt(card.dataset.col) + 1, y: card.dataset.row};
                    break;
                case "ArrowDown":
                case "S":
                    newCoordinate = {x: card.dataset.col, y: parseInt(card.dataset.row) + 1};
                    break;
            }
            targetField = getFieldByCoordinate(newCoordinate);
            moveCard(card, targetField);
        });
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
    return (fieldBelow === null || fieldBelow.classList.contains('card'));
}

game.init();
