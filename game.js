const game = {
    init : function() {
        this.gameField = document.querySelector('#game-field');
        this.cols = 6;
        this.rows = 8;
        this.fallSpeed = "";
        this.imgSources = this.initImgSources();
        this.initBlocks();
    },

    createBlock() {
        const col = Math.round(Math.random() * this.cols);
        const block = getBlockByCoordinate({x: col, y: 0});
        const imgSource = this.imgSources[Math.round(Math.random() * this.imgSources.length)];
        const imgTag = document.createElement('img');

        imgTag.src = imgSource;
        imgTag.classList.add('hidden');
        block.appendChild(imgTag);
        block.classList.add('block');
    }
}

function getBlockByCoordinate(coordinate) {
    return document.querySelector(`div[data-row="${coordinate.y}"][data-col="${coordinate.x}"`);
}