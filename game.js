import {config} from './config.js';


const game = {
    init : function() {
        this.gameField = document.querySelector('#game-field');
        this.difficulty = 'medium'
        this.openCards = 0;
        this.firstImg = null;
        this.secondImg = null;
        this.initBlocks();
        this.createCard();
        this.playerMoveBlock();
        this.revealCards();
    },

    createCard: function() {
        const imgTag = this.getRandomImageTag()
        this.createRandomCardTag(imgTag);

        this.fallTimerId = setInterval( () => {
            let currentField = getCurrentCard();
            const fieldBelow = getFieldBelow(currentField);

            moveCard(currentField, fieldBelow);

            currentField = getCurrentCard();
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

            `<div class="field"
                        data-row="${row}"
                        data-col="${col}"
                        >
                    </div>`);
    },

    playerMoveBlock: function () {
        document.addEventListener('keydown', (event) => {
            const card = getCurrentCard();
            const newCoordinate = this.getMoveDirection(event.key, card);
            const targetField = getFieldByCoordinate(newCoordinate);

            moveCard(card, targetField);
        });
    },

    getMoveDirection: function (playerInput, card) {
        console.log(playerInput);
        playerInput = playerInput.toLowerCase();
        switch (playerInput) {
                case "ArrowLeft":
                case "a":
                    return {x: parseInt(card.dataset.col) - 1, y: card.dataset.row};
                    break;
                case "ArrowRight":
                case "d":
                    return {x: parseInt(card.dataset.col) + 1, y: card.dataset.row};
                    break;
                case "ArrowDown":
                case "s":
                    return {x: card.dataset.col, y: parseInt(card.dataset.row) + 1};
                    break;
            }
    },

    revealCards: function() {
        this.gameField.addEventListener('click', (event) => {
            console.log(`reveal image this: ${this}`)
            if(event.target.classList.contains('card')) {
                if (this.openCards < 2) {
                    let childImage = getChildImage(event.target);
                    childImage.style.width = '80px';
                    childImage.style.height = '80px';
                    childImage.classList.remove('hidden');
                    if (this.openCards === 0) {
                        this.firstImg = childImage;
                        this.openCards++;
                    } else if (this.openCards === 1) {
                        this.secondImg = childImage;
                        this.openCards++;
                        if (areImagesMatched(this.firstImg, this.secondImg)) {
                            this.destroyCards(this.firstImg.parentElement, this.secondImg.parentElement);
                        } else {
                            setTimeout(this.hideImages, config.hideTimeOut);
                        }
                    }
                }
            }
        })
    },

    hideImages: function () {
        console.log(`hide image this: ${this}`)

        game.firstImg.removeAttribute('style');
        game.firstImg.classList.add('hidden');
        game.secondImg.removeAttribute('style');
        game.secondImg.classList.add('hidden');
        game.openCards = 0;
        console.log(this.openCards);

        /*let startTime;
        function animate(currentTime) {
            console.log('145-os sor');
            if(!startTime) {
                startTime = currentTime;
                return;
            }

            const timeProgress = (currentTime - startTime) / config.animationTime;

            if (timeProgress < 1) {
                console.log('154-es sor');
                const animationProgress = (1 - config.hideAnimationProgress(timeProgress)) * config.cardSize;
                this.firstImg.style.width =
                this.firstImg.style.height =
                this.secondImg.style.width =
                this.secondImg.style.height = animationProgress + ' px';
                requestAnimationFrame(animate);
            } else {
                delete this.firstImg.style;
                this.firstImg.classList.add('hidden');
                delete this.secondImg.style;
                this.secondImg.classList.add('hidden');
                this.openCards = 0;
                console.log(this.openCards);
            }
        }
        requestAnimationFrame(animate);*/
    },

    destroyCards: function (firstCard, secondCard) {
        const firstCol = firstCard.dataset.col;
        const firstRow = firstCard.dataset.row;
        const secondCol = secondCard.dataset.col;
        const secondRow = secondCard.dataset.row;

        switch (getCardsOrientation(firstCard, secondCard)) {
            case 'horizontal':
                destroyCard(firstCard);
                sinkColumn(firstCard)
                destroyCard(secondCard);
                sinkColumn(secondCard);
                break;
            case 'vertical':
                destroyCard(firstCard);
                sinkColumn(firstCard)
                destroyCard(secondCard);
                sinkColumn(secondCard);
                break;
            case 'nonneighbour':
                destroyCard(firstCard);
                sinkColumn(getFieldByCoordinate({x: firstCol, y: firstRow}));
                destroyCard(secondCard);
                sinkColumn(getFieldByCoordinate({x: secondCol, y: secondRow}));

                break;
        }
        this.openCards = 0;
    }
}

function areImagesMatched(firstImg,secondImg){
    return firstImg.src === secondImg.src;
}

function getChildImage(card){
    return card.querySelector('img');
}


function getFieldByCoordinate(coordinate) {
    return document.querySelector(`div[data-row="${coordinate.y}"][data-col="${coordinate.x}"]`);
}

function getCurrentCard() {
    return document.querySelector('.game-field .row .field.card.current');
}

function setCurrentScore(newCurrentScore) {
    const scoreTag = document.querySelector('#current-score');
    scoreTag.innerText = `Current score: ${newCurrentScore}`;
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

function getMatchedCards() {
    return Array
        .from(document.querySelectorAll('.card img'))
        .map(imgTag => imgTag.parentElement);
}

function getCardsOrientation(firstCard, secondCard) {
    const colDifference = Number(firstCard.dataset.col) - Number(secondCard.dataset.col);
    const rowDifference = Number(firstCard.dataset.row) - Number(secondCard.dataset.row);

    if (colDifference === 0) {
        return 'vertical';
    } else if(rowDifference === 0) {
        return 'horizontal';
    } else {
        return 'nonneighbour';
    }
}

function destroyCard(card) {
    const clonedCard = document.createElement('div');
    const currentScore = getCurrentScore();
    clonedCard.classList.add('field');
    clonedCard.dataset.col = card.dataset.col;
    clonedCard.dataset.row = card.dataset.row;
    card.parentElement.replaceChild(clonedCard, card);
    setCurrentScore(currentScore + config.pointGain)

}

function sinkColumn(card) {
    const col = Number(card.dataset.col);
    let row = Number(card.dataset.row) - 1;
    let fieldBelow = card;
    let cardToSink = getFieldByCoordinate({x: col, y: row});

    while(cardToSink !== null && cardToSink.classList.contains('card')) {
        const imgTag = cardToSink.querySelector('img');
        cardToSink.classList.remove('card');
        fieldBelow.classList.add('card');
        fieldBelow.appendChild(imgTag);

        fieldBelow = cardToSink;
        row--;
        cardToSink = getFieldByCoordinate({x: col, y: row});
    }

    /*Array
        .from(document.querySelectorAll(`.card[data-col="${card.dataset.col}"]`))
        .filter(elem => card.dataset.row > elem.dataset.row)
        .sort((elem1, elem2) => {
            return elem1.dataset.row < elem2.dataset.row ? 1: -1
        })
        .forEach(elem => {
            moveCard(elem, getFieldBelow(elem))
        });*/
}

game.init();
