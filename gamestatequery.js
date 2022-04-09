export function setHighScore(newHighScore) {
    document.querySelector('#high-score').innerText = `High Score: ${newHighScore}`
}

function getScore(tagId) {
    let getScore = document.querySelector(tagId);
    let Score = getScore.innerText.split(':');
    return parseInt(Score[1]);
}

export function getHighScore() {
    return getScore('#high-score')
}

export function getCurrentScore() {
    return getScore('#current-score')
}

export function getFieldByCoordinate(coordinate) {
    return document.querySelector(`div[data-row="${coordinate.y}"][data-col="${coordinate.x}"]`);
}

export function getCurrentCard() {
    return document.querySelector('.game-field .row .field.card.current');
}

export function setCurrentScore(newCurrentScore) {
    const scoreTag = document.querySelector('#current-score');
    scoreTag.innerText = `Current score: ${newCurrentScore}`;
}

export function getFieldBelow(field) {
    const col = parseInt(field.dataset.col);
    const row = parseInt(field.dataset.row) + 1;

    return getFieldByCoordinate({x: col, y: row});
}

export function isCardTouchedDown(field) {
    const fieldBelow = getFieldBelow(field);
    return (fieldBelow === null || fieldBelow.classList.contains('card'));
}

export function getCardsOrientation(firstCard, secondCard) {
    const colDifference = Number(firstCard.dataset.col) - Number(secondCard.dataset.col);
    const rowDifference = Number(firstCard.dataset.row) - Number(secondCard.dataset.row);

    if (colDifference === 0) {
        return 'vertical';
    } else if (rowDifference === 0) {
        return 'horizontal';
    } else {
        return 'nonneighbour';
    }
}