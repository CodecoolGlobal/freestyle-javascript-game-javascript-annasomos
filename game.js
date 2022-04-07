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

            `<div class=" field"
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
                            alert('images match!');
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
    refreshHighScore(){
        let currentScore = getCurrentScore();
        let highScore = getHighScore();
        if (currentScore > highScore) {
            window.localStorage.setItem('highScore', currentScore);
            setHighScore(currentScore)
        }
    }
}

function setHighScore(newHighScore){
    document.querySelector('#high-score').innerText = `High Score: ${newHighScore}`
}

function getScore(tagId){
     let getScore = document.querySelector(tagId);
     let Score = getScore.innerText.split(':');
     return parseInt(Score[1]);
}

function getHighScore(){
 return getScore('#high-score')
}

function getCurrentScore(){
 return getScore('#current-score')
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
