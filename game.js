const game = {
    init : function() {
        this.gameField = document.querySelector('#game-field');
        this.cols = 6;
        this.rows = 8;
        this.fallSpeed = "";
        //this.imgSources = this.initImgSources();
        this.initBlocks();
    },

    createBlock: function() {
        const col = Math.round(Math.random() * this.cols);
        const field = getFieldByCoordinate({x: col, y: 0});
        const imgSource = this.imgSources[Math.round(Math.random() * this.imgSources.length)];
        const imgTag = document.createElement('img');

        imgTag.src = imgSource;
        imgTag.classList.add('hidden');
        field.appendChild(imgTag);
        field.classList.add('card');


    },

    initBlocks: function() {
        this.setGameFieldSize();
        for (let row = 0; row < this.rows; row++) {
            const rowElement = this.addRow(this.gameField);
            for (let col = 0; col < this.cols; col++) {
                this.addCell(rowElement, row, col);
            }
        }
    },

    setGameFieldSize: function() {
        this.gameField.style.width = (this.gameField.dataset.cellWidth * this.cols) + 'px';
        this.gameField.style.height = (this.gameField.dataset.cellHeight * this.rows) + 'px';
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

game.init();