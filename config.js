export const config = {
    cols: 6,
    rows: 8,
    fallSpeed: {
        easy: 1000,
        medium: 400,
        hard: 200
    },
    cardImageSource : 'img/tetrisblock.png',
    memoryImageSources : [
        'img/puppy1.png',
        'img/puppy2.png',
        'img/puppy3.png',
        'img/puppy4.png',
        'img/puppy5.png',
        'img/puppy6.png',
        'img/puppy7.png',
        'img/puppy8.png',
        'img/puppy9.png',
        'img/puppy10.png',
        'img/puppy11.png',
        'img/puppy12.png',
        'img/puppy13.png',
        'img/puppy14.png',
        'img/puppy15.png',
        'img/puppy16.png'

    ],
    hideTimeOut : 1000,
    animationTime: 1500,
    hideAnimationProgress: function (timeProgress) {return timeProgress},
    cardSize: 80,
    pointGain: 10
};

