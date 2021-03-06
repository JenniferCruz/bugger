// TODO: sprite sheet to animate movement of shoes and bugs http://stackoverflow.com/questions/3062229/animated-gif-in-html5-canvas
// TODO: bug with enemies going through some of the obstacles
// TODO: bug with bee not being able to move through in second level

/*
* This would be the persistence.
* Everything comes together here, so you'll find A LOT of set up code.
* This file is the meeting point between the canvas and the game logic.
* Here, variables are set up: images are loaded and the layout of the world is created
* (along with the elements that will need to be passed as parameters to create a new world).
*
* Here, you'll find several functions:
*
* getAvatar() and getAvatarDimensionsRatios()
*     Those functions are used to parse player selection from url
*     and adjust the width to height ratio of the image, when drawing it in the canvas.
*
* drawGameOver(), drawWin() and introduceLevel2()
*       Those functions just draw the screen according to game result or status. Pretty much what the names suggest.
*
* level1()
*       In here, everything related to level 1 is set up,
*       so you'll find a lot of boxes being created for the hero or player,
*       the enemies, the main borders of the canvas and additional decorative elements and obstacles.
*       Finally, all those parameters are passed to ne World() constructor
*       and the scenery containing all of the information is returned.
*
* level2()
*       Pretty much same as level 1, but in level 2.
*       Set up code is even more here, since the layout is intended to be a little more complex.
*
* game()
*      This function receives a world or scenery (given by level1() or level())
*      and defines a few functions to interact with the user and canvas. Namely:
*      * draw()
*           Draws the current state of the game
*      * tick()
*           Makes a call to the tick() function in world
*           (where weverything that moves is updated) and updates lives count.
*      * keepDrawing()
*           If game is on (that is, the player hasn't yet reached the goal and there are still lives),
*           it'll make a call to draw() and tick(). Otherwise, it'll either drawGameOver(), drawWin() or
*           introduceLevel2() and call game() again with the new level.
*      * functions to read user input
*           An event listener is added to read and process user input.
*           Specifically, whenever use presses any of the arrow keys in the keyboard.
* */

var currentLevel = 1;
var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');


/**
 * @description parses url to get character chosen by player
 * */
function getAvatar() {
    var urlParams = window.location.search;
    return urlParams.split('=')[1] || 'snail';
}

/**
 * @description store images width to height ratios to use when drawing
 * */
function getAvatarDimensionsRatios(avatar) {
    var ratios = [1, 1];
    if (avatar == 'ladybug') {
        ratios = [0.9, 1];
    }
    if (avatar == 'grasshopper') {
        ratios = [1, 0.51];
    }
    if (avatar == 'snail') {
        ratios = [1, 0.75];
    }
    if (avatar == 'spider') {
        ratios = [1, 0.9];
    }
    if (avatar == 'bee') {
        ratios = [1, 0.9];
    }
    if (avatar == 'spider') {
        ratios = [1, 0.8];
    }
    return ratios;
}

Resources.load([
    'images/player_snail.png',
    'images/player_grasshopper.png',
    'images/player_snake.png',
    'images/player_spider.png',
    'images/player_ladybug.png',
    'images/bush.png',
    'images/cave_2.png',
    'images/fence_left.png',
    'images/fountain.png',
    'images/fence_2.png',
    'images/forest_2.png',
    'images/grass-block.png',
    'images/cinderella-shoe.png',
    'images/boot.png',
    'images/boot.gif',
    'images/foot.png',
    'images/rubber-sandals.png',
    'images/tennis.png',
    'images/loafer.png',
    'images/player_bee.png',
    'images/player_grasshopper.png',
    'images/stone-block.png',
    'images/bonfire.png',
    'images/tulips.png',
    'images/water-block.png',
    'images/tree.png',
    'images/fireworks.png',
    'images/picnic-basket.png',
    'images/hot-air-balloon.png',
    'images/hammock.png',
    'images/mushroom.png',
    'images/rain-boots.png',
    'images/platform-shoe.png',
    'images/sandals.png',
    'images/shoe_2.png',
    'images/flip-flop.png',
    'images/tulip_1.png',
    'images/tulip_2.png',
    'images/rainbow.png',
    'images/log.png',
    'images/bush_fence_left.png',
    'images/heart.png',
    'images/dead.png',
    'images/award.png'
]);

/**
 * @description Design to be drawn when game is over
 * */
var drawGameOver = function() {
    GAME_OVER_SOUND.play();
    ctx.fillStyle = '#000';
    ctx.rect(0, 0, 505, 606);
    ctx.fill();
    ctx.drawImage(Resources.get('images/dead.png'), 52, 60, 300, 300);
    ctx.font = '80px "Lucida Sans Unicode"';
    ctx.fillStyle = '#fff';
    ctx.fillText('Game', 220, 400);
    ctx.fillText('Over', 250, 470);
};

/**
 * @description Design to be drawn when player wins
 * */
var drawWin = function() {
    WINNING_SOUND.play();
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, 505, 606);
    ctx.globalAlpha = 1;
    ctx.drawImage(Resources.get('images/award.png'), 70, 47, 365, 512);
    ctx.font = '80px "Trebuchet MS"';
    ctx.fillStyle = '#fff';
    ctx.fillText('You win!', 100, 500);
};

/**
 * @description Design to be drawn when player finishes level 1
 * */
var introduceLevel2 = function() {
    WINNING_SOUND.play();
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, 505, 606);
    ctx.globalAlpha = 1;
    ctx.drawImage(Resources.get('images/fireworks.png'), 0, 47, 512, 512);
    ctx.font = '70px "Trebuchet MS"';
    ctx.fillStyle = '#FFBF00';
    ctx.fillText('Great!', 160, 380);
    ctx.font = '40px "Trebuchet MS"';
    ctx.fillStyle = '#FF8000';
    ctx.fillText('Move on to', 160, 420);
    ctx.font = '80px "Arial Black"';
    ctx.fillStyle = '#FE642E';
    ctx.fillText('level 2', 120, 500);
};

/**
 * @description Set up world layout and characters for level 1
 * */
var level1 = function() {
    // Variables to set up scenery

    // hero
    var avatar = 'images/player_' + getAvatar() + '.png';
    var ratios = getAvatarDimensionsRatios(getAvatar());
    var player = Box({
        x: 30,
        y: 520
    }, {
        width: (50 * ratios[0]),
        height: (50 * ratios[1])
    }, avatar);

    // enemies
    var enemy1 = Box({
        x: 21,
        y: 230
    }, {
        width: 50,
        height: 19
    }, 'images/rubber-sandals.png');
    enemy1.setVelocity({
        vx: 0.4,
        vy: 0
    });
    var enemy2 = Box({
        x: 21,
        y: 385
    }, {
        width: 50,
        height: 31
    }, 'images/tennis.png');
    enemy2.setVelocity({
        vx: 1,
        vy: 0
    });
    var enemy3 = Box({
        x: 25,
        y: 45
    }, {
        width: 50,
        height: 44
    }, 'images/cinderella-shoe.png');
    enemy3.setVelocity({
        vx: 0.4,
        vy: 0
    });
    var enemy4 = Box({
        x: 200,
        y: 100
    }, {
        width: 50,
        height: 50
    }, 'images/boot.gif');
    enemy4.setVelocity({
        vx: 1,
        vy: 0
    });
    var enemy5 = Box({
        x: 200,
        y: 250
    }, {
        width: 50,
        height: 30
    }, 'images/foot.png');
    enemy5.setVelocity({
        vx: 1,
        vy: 0
    });
    var enemy6 = Box({
        x: 400,
        y: 470
    }, {
        width: 50,
        height: 18
    }, 'images/loafer.png');
    enemy6.setVelocity({
        vx: 1,
        vy: 0
    });

    // borders
    var horizontalTop = Box({
        x: 0,
        y: 0
    }, {
        width: 505,
        height: 40
    }, 'images/forest_2.png');
    var horizontalBottom = Box({
        x: 5,
        y: 585
    }, {
        width: 495,
        height: 20
    }, 'images/fence_2.png');
    var verticalLeft = Box({
        x: 0,
        y: 35
    }, {
        width: 20,
        height: 565
    }, 'images/fence_left.png');
    var verticalRight = Box({
        x: 485,
        y: 35
    }, {
        width: 20,
        height: 565
    }, 'images/fence_left.png');

    // decor and obstacles
    var decors = [];
    for (var i = 0; i < 20; i++) {
        decors.push({
            x: 0,
            y: i * 30,
            'sprite': 'images/grass-block.png',
            'qty': 11,
            'width': 50,
            'height': 50
        });
    }
    decors.push({
        x: 290,
        y: 30,
        'sprite': 'images/bush.png',
        'qty': 1,
        'isObstacle': true,
        'width': 70,
        'height': 40
    });
    decors.push({
        x: 420,
        y: 30,
        'sprite': 'images/bush.png',
        'qty': 1,
        'isObstacle': true,
        'width': 70,
        'height': 40
    });
    decors.push({
        x: 305,
        y: 65,
        'sprite': 'images/bush.png',
        'qty': 1,
        'isObstacle': true,
        'width': 50,
        'height': 28
    });
    decors.push({
        x: 420,
        y: 65,
        'sprite': 'images/bush.png',
        'qty': 1,
        'isObstacle': true,
        'width': 50,
        'height': 28
    });
    decors.push({
        x: 360,
        y: 170,
        'sprite': 'images/bonfire.png',
        'qty': 1,
        'isObstacle': true,
        'width': 65,
        'height': 65
    });
    decors.push({
        x: 120,
        y: 100,
        'sprite': 'images/fountain.png',
        'qty': 1,
        'isObstacle': true,
        'width': 80,
        'height': 80
    });
    for (var p = 0; p < 5; p++) {
        decors.push({
            x: 135,
            y: (180 + 32 * p),
            'sprite': 'images/water-block.png',
            'qty': 1,
            'isObstacle': true,
            'width': 50,
            'height': 50
        });
    }
    decors.push({
        x: 300,
        y: 365,
        'sprite': 'images/stone-block.png',
        'qty': 2,
        'isObstacle': true,
        'width': 50,
        'height': 50
    });
    decors.push({
        x: 300,
        y: 398,
        'sprite': 'images/stone-block.png',
        'qty': 2,
        'isObstacle': true,
        'width': 50,
        'height': 50
    });
    decors.push({
        x: 260,
        y: 355,
        'sprite': 'images/tulips.png',
        'qty': 1,
        'isObstacle': true,
        'width': 50,
        'height': 50
    });
    decors.push({
        x: 260,
        y: 400,
        'sprite': 'images/tulips.png',
        'qty': 1,
        'isObstacle': true,
        'width': 50,
        'height': 50
    });
    decors.push({
        x: 390,
        y: 355,
        'sprite': 'images/tulips.png',
        'qty': 1,
        'isObstacle': true,
        'width': 50,
        'height': 50
    });
    decors.push({
        x: 390,
        y: 400,
        'sprite': 'images/tulips.png',
        'qty': 1,
        'isObstacle': true,
        'width': 50,
        'height': 50
    });

    // world
    var scenery = new World({
        hero: player,
        evils: [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6],
        goal: Box({
            x: 365,
            y: 20
        }, {
            width: 50,
            height: 50
        }, 'images/cave_2.png'),
        staticObjects: [horizontalTop, verticalLeft, horizontalBottom, verticalRight],
        decor: decors
    });

    return scenery;
};

/**
 * @description Set up world layout and characters for level 2
 * */
var level2 = function() {
    // hero
    var avatar = 'images/player_' + getAvatar() + '.png';
    var ratios = getAvatarDimensionsRatios(getAvatar());
    var player = Box({
        x: 400,
        y: 52
    }, {
        width: (45 * ratios[0]),
        height: (45 * ratios[1])
    }, avatar);

    // borders
    var horizontalTop = Box({
        x: 0,
        y: 0
    }, {
        width: 505,
        height: 40
    }, 'images/forest_2.png');
    var horizontalBottom = Box({
        x: 18,
        y: 585
    }, {
        width: 470,
        height: 20
    }, 'images/fence_2.png');
    var verticalLeft = Box({
        x: 0,
        y: 35
    }, {
        width: 20,
        height: 600
    }, 'images/bush_fence_left.png');
    var verticalRight = Box({
        x: 485,
        y: 35
    }, {
        width: 20,
        height: 565
    }, 'images/fence_left.png');

    // decor and additional obstacles
    var decors = [];

    // FIRST, THE "WALKABLE PATH"

    // 4 stone blocks at top right (entry point)
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 380,
            y: 40 + (i * 28),
            'sprite': 'images/stone-block.png',
            'qty': 2,
            'width': 40,
            'height': 40
        });
    }

    // cave - (entry point)
    decors.push({
        x: 400,
        y: 25,
        'sprite': 'images/cave_2.png',
        'qty': 1,
        'width': 50,
        'height': 50
    });

    // second stone blocks offshoot around center
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 260,
            y: 250 + (i * 28),
            'sprite': 'images/stone-block.png',
            'qty': 2,
            'width': 40,
            'height': 40
        });
    }

    // third 4 stone blocks offshoot around center
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 260,
            y: 400 + (i * 28),
            'sprite': 'images/stone-block.png',
            'qty': 2,
            'width': 40,
            'height': 40
        });
    }

    // FIRST horizontal stone path
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 20,
            y: (28 * i) + 100,
            'sprite': 'images/stone-block.png',
            'qty': 11,
            'width': 40,
            'height': 40
        });
    }

    // first 4 stone blocks offshoot around center
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 260,
            y: 150 + (i * 28),
            'sprite': 'images/stone-block.png',
            'qty': 2,
            'width': 40,
            'height': 40
        });
    }

    // SECOND horizontal stone path
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 100,
            y: (i * 28) + 300,
            'sprite': 'images/stone-block.png',
            'qty': 9,
            'width': 40,
            'height': 40
        });
    }

    // FIRST vertical stone path on the left
    for (var i = 0; i < 13; i++) {
        decors.push({
            x: 100,
            y: (i * 28) + 40,
            'sprite': 'images/stone-block.png',
            'qty': 2,
            'width': 40,
            'height': 40
        });
    }

    // SECOND vertical stone path on the right
    for (var i = 0; i < 6; i++) {
        decors.push({
            x: 380,
            y: (i * 28) + 300,
            'sprite': 'images/stone-block.png',
            'qty': 2,
            'width': 40,
            'height': 40
        });
    }

    // THIRD horizontal stone path
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 20,
            y: (i * 28) + 450,
            'sprite': 'images/stone-block.png',
            'qty': 11,
            'width': 40,
            'height': 40
        });
    }

    // THIRD vertical stone path leading to goal
    for (var i = 0; i < 5; i++) {
        decors.push({
            x: 60,
            y: (i * 28) + 450,
            'sprite': 'images/stone-block.png',
            'qty': 2,
            'width': 40,
            'height': 40
        });
    }

    // second 4-stone blocks offshoot on the left
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 20,
            y: (28 * i) + 210,
            'sprite': 'images/stone-block.png',
            'qty': 2,
            'width': 40,
            'height': 40
        });
    }


    // NOW, OBSTACLES AROUND THE "WALKABLE PATH"

    // 4 grass blocks top left
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 20,
            y: 37 + (i * 28),
            'sprite': 'images/grass-block.png',
            'qty': 2,
            'isObstacle': true,
            'width': 40,
            'height': 35
        });
    }

    //2 grass blocks column on left
    for (var i = 0; i < 6; i++) {
        decors.push({
            x: 20,
            y: 270 + (i * 28),
            'sprite': 'images/grass-block.png',
            'qty': 2,
            'isObstacle': true,
            'width': 40,
            'height': 40
        });
    }

    // left bottom grass
    for (var i = 0; i < 3; i++) {
        decors.push({
            x: 20,
            y: 510 + (i * 28),
            'sprite': 'images/grass-block.png',
            'qty': 1,
            'isObstacle': true,
            'width': 40,
            'height': 40
        });
    }

    // grass blocks top center
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 180,
            y: 37 + (i * 28),
            'sprite': 'images/grass-block.png',
            'qty': 5,
            'isObstacle': true,
            'width': 40,
            'height': 35
        });
    }

    // 2 grass blocks left around center
    for (var i = 0; i < 2; i++) {
        decors.push({
            x: 20,
            y: 160 + (i * 10),
            'sprite': 'images/grass-block.png',
            'qty': 2,
            'isObstacle': true,
            'width': 40,
            'height': 40
        });
    }

    // grass blocks in right from top to bottom
    for (var i = 0; i < 17; i++) {
        decors.push({
            x: 460,
            y: 38 + (i * 28),
            'sprite': 'images/grass-block.png',
            'qty': 2,
            'isObstacle': true,
            'width': 40,
            'height': 40
        });
    }

    // horizontal bottom grass segment
    for (var i = 0; i < 3; i++) {
        decors.push({
            x: 140,
            y: 510 + (i * 28),
            'sprite': 'images/grass-block.png',
            'qty': 10,
            'isObstacle': true,
            'width': 40,
            'height': 40
        });
    }

    // 2 columns of grass blocks around center left
    for (var i = 0; i < 4; i++) {
        decors.push({
            x: 180,
            y: 160 + (i * 34),
            'sprite': 'images/grass-block.png',
            'qty': 2,
            'isObstacle': true,
            'width': 40,
            'height': 40
        });
    }

    // 3 columns of grass blocks around center right
    for (var i = 0; i < 4; i++) {
        decors.push({
            x: 340,
            y: 160 + (i * 35),
            'sprite': 'images/grass-block.png',
            'qty': 3,
            'isObstacle': true,
            'width': 40,
            'height': 40
        });
    }

    // 2 columns of grass blocks on center
    decors.push({
        x: 260,
        y: 210,
        'sprite': 'images/grass-block.png',
        'qty': 2,
        'isObstacle': true,
        'width': 40,
        'height': 40
    });

    // grass blocks around center left -
    for (var i = 0; i < 3; i++) {
        decors.push({
            x: 180,
            y: 360 + (i * 25),
            'sprite': 'images/grass-block.png',
            'qty': 2,
            'isObstacle': true,
            'width': 40,
            'height': 40
        });
    }

    // 2 grass blocks around center left
    decors.push({
        x: 100,
        y: 410,
        'sprite': 'images/grass-block.png',
        'qty': 2,
        'isObstacle': true,
        'width': 40,
        'height': 40
    });

    // grass blocks around center right
    for (var i = 0; i < 3; i++) {
        decors.push({
            x: 340,
            y: 360 + (i * 25),
            'sprite': 'images/grass-block.png',
            'qty': 1,
            'isObstacle': true,
            'width': 40,
            'height': 40
        });
    }

    // 2 grass blocks around center
    decors.push({
        x: 260,
        y: 360,
        'sprite': 'images/grass-block.png',
        'qty': 2,
        'isObstacle': true,
        'width': 40,
        'height': 40
    });

    // ADDITIONAL DECORATIVE ELEMENTS
    decors.push({
        x: 200,
        y: 50,
        'sprite': 'images/mushroom.png',
        'qty': 3,
        'isObstacle': true,
        'width': 50,
        'height': 50
    });

    decors.push({
        x: 30,
        y: 55,
        'sprite': 'images/log.png',
        'qty': 1,
        'isObstacle': true,
        'width': 60,
        'height': 34
    });

    decors.push({
        x: 190,
        y: 200,
        'sprite': 'images/hot-air-balloon.png',
        'qty': 1,
        'isObstacle': true,
        'width': 60,
        'height': 87
    });


    decors.push({
        x: 30,
        y: 310,
        'sprite': 'images/tree.png',
        'qty': 1,
        'isObstacle': true,
        'width': 60,
        'height': 80
    });

    decors.push({
        x: 195,
        y: 380,
        'sprite': 'images/picnic-basket.png',
        'qty': 1,
        'isObstacle': true,
        'width': 50,
        'height': 50
    });

    decors.push({
        x: 355,
        y: 190,
        'sprite': 'images/hammock.png',
        'qty': 1,
        'isObstacle': true,
        'width': 100,
        'height': 100
    });

    for (var i = 0; i < 9; i++) {
        var flower = 'tulip_' + (i % 2 + 1);
        decors.push({
            x: 160 + (i * 30),
            y: 530,
            'sprite': 'images/' + flower + '.png',
            'qty': 1,
            'isObstacle': true,
            'width': 50,
            'height': 50
        });
    }


    // enemies
    var enemy = Box({
        x: 22,
        y: 105
    }, {
        width: 50,
        height: 44
    }, 'images/rain-boots.png');
    enemy.setVelocity({
        vx: 2,
        vy: 0
    });
    var enemy2 = Box({
        x: 50,
        y: 215
    }, {
        width: 50,
        height: 44
    }, 'images/platform-shoe.png');
    enemy2.setVelocity({
        vx: 1,
        vy: 0
    });
    var enemy3 = Box({
        x: 120,
        y: 330
    }, {
        width: 50,
        height: 13
    }, 'images/flip-flop.png');
    enemy3.setVelocity({
        vx: 1,
        vy: 0
    });
    var enemy4 = Box({
        x: 30,
        y: 480
    }, {
        width: 50,
        height: 17
    }, 'images/shoe_2.png');
    enemy4.setVelocity({
        vx: 1,
        vy: 0
    });
    var enemy5 = Box({
        x: 400,
        y: 460
    }, {
        width: 50,
        height: 31
    }, 'images/sandals.png');
    enemy5.setVelocity({
        vx: 1,
        vy: 0
    });

    // world
    var scenery = new World({
        hero: player,
        evils: [enemy, enemy2, enemy3, enemy4, enemy5],
        goal: Box({
            x: 50,
            y: 550
        }, {
            width: 100,
            height: 50
        }, 'images/rainbow.png'),
        staticObjects: [horizontalTop, verticalLeft, horizontalBottom, verticalRight],
        decor: decors
    });

    return scenery;
};

var game = function(level) {

    var scenery = level;

    // sceneryCanvas is a singleton, so an object is created
    var sceneryCanvas = {};

    sceneryCanvas.draw = function() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 505, 606);
        scenery.getAllBoxes().forEach(function(box) {
            ctx.drawImage(Resources.get(box.img), box.getPosition().x, box.getPosition().y, box.size.width, box.size.height);
        });
    };

    sceneryCanvas.tick = function() {
        scenery.tick();
        document.getElementById('player_lives').innerHTML = lives;
    };

    sceneryCanvas.keepDrawing = function() {
        if (scenery.isGameOn()) {
            sceneryCanvas.draw();
            sceneryCanvas.tick();
            window.requestAnimationFrame(function() {
                sceneryCanvas.keepDrawing();
            });
        } else if (scenery.isPlayerOnGoal() && currentLevel == 1) {
            introduceLevel2();
            currentLevel++;
            setTimeout(function() {
                game(level2());
            }, 1000);
        } else if (scenery.isPlayerOnGoal()) {
            drawWin();
        } else {
            drawGameOver();
        }
    };

    sceneryCanvas.keepDrawing();

    document.addEventListener('keyup', function(e) {
        var playerAction = {
            37: function() {
                scenery.leftAction();
            },
            38: function() {
                scenery.upAction();
            },
            39: function() {
                scenery.rightAction();
            },
            40: function() {
                scenery.downAction();
            }
        };
        playerAction[e.keyCode] && playerAction[e.keyCode]();
    });
};


Resources.onReady(function() {
    game(level1());
});