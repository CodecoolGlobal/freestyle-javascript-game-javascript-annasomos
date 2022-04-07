export const config = {
    cols: 6,
    rows: 8,
    fallSpeed: {
        easy: 1000,
        medium: 400,
        hard: 200
    },
    cardImageSource : 'img/memoris_card_block',
    memoryImageSources : ['img/memoris_card_block'],
    hideTimeOut : 1000
    animationTime: 1500,
    hideAnimationProgress: function (timeProgress) {return timeProgress},
    cardSize: 80
};

