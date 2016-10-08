// TODO: [required] Add read.me
// TODO: [required] Use code validators
// TODO: [optional] Check tests run ok
// TODO: [required] Make game a little harder
// TODO: [optional] Add 2 or 3 additional levels
// TODO: [optional] spritesheet to animate movement of shoes and bugs http://stackoverflow.com/questions/3062229/animated-gif-in-html5-canvas
// TODO: [optional?] bug with tenni shoe going through obstacles

function getAvatar() {
    var urlParams = window.location.search;
    return urlParams.split('=')[1] || 'snail';
}

function getAvatarDimensionsRatios(avatar) {
    var ratios = [1, 1];
    if (avatar == 'ladybug') {
        ratios = [.9, 1];
    }
    if (avatar == 'grasshopper') {
        ratios = [1, .51];
    }
    if (avatar == 'snail') {
        ratios = [1, .75];
    }
    if (avatar == 'spider') {
        ratios = [1, .9];
    }
    return ratios;
}

var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

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
    'images/heart.png',
    'images/dead.png',
    'images/award.png'
]);


var gameOver = function () {
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

var youWin = function () {
    WINNING_SOUND.play();
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, 505, 606);
    ctx.globalAlpha = 1;
    ctx.drawImage(Resources.get('images/award.png'), 70, 47, 365, 512);
    ctx.font = '80px "Trebuchet MS"';
    ctx.fillStyle = '#fff';
    ctx.fillText('You win!', 100, 500);
};

var game = function () {

    // Variables to set up scenery
    // hero
    var avatar = 'images/player_' + getAvatar() + '.png';
    var ratios = getAvatarDimensionsRatios(getAvatar());
    var player = Box({x: 30, y: 520}, {width: (50 * ratios[0]), height: (50 * ratios[1])}, avatar);

    // enemies
    var human = Box({x: 21, y: 230}, {width: 50, height: 19}, 'images/rubber-sandals.png');
    human.setVelocity({vx: 0.4, vy: 0});
    var human2 = Box({x: 21, y: 385}, {width: 50, height: 31}, 'images/tennis.png');
    human2.setVelocity({vx: 1, vy: 0});
    var human3 = Box({x: 25, y: 45}, {width: 50, height: 44}, 'images/cinderella-shoe.png');
    human3.setVelocity({vx: 0.4, vy: 0});
    var human4 = Box({x: 200, y: 100}, {width: 50, height: 50}, 'images/boot.gif');
    human4.setVelocity({vx: 1, vy: 0});
    var human5 = Box({x: 200, y: 250}, {width: 50, height: 30}, 'images/foot.png');
    human5.setVelocity({vx: 1, vy: 0});
    var human6 = Box({x: 400, y: 470}, {width: 50, height: 18}, 'images/loafer.png');
    human6.setVelocity({vx: 1, vy: 0});

    // borders
    var horizontalTop = Box({x: 0, y: 0}, {width: 505, height: 40}, 'images/forest_2.png');
    var horizontalBottom = Box({x: 5, y: 585}, {width: 495, height: 20}, 'images/fence_2.png');
    var verticalLeft = Box({x: 0, y: 35}, {width: 20, height: 565}, 'images/fence_left.png');
    var verticalRight = Box({x: 485, y: 35}, {width: 20, height: 565}, 'images/fence_left.png');

    // decor and obstacles
    var decors = [];
    for (var i = 0; i < 20; i++) {
        decors.push({x: 0, y: i * 30, 'sprite': 'images/grass-block.png', 'qty': 11, 'width': 50, 'height': 50});
    }
    decors.push({x: 290, y: 30, 'sprite': 'images/bush.png', 'qty': 1, 'isObstacle': true, 'width': 70, 'height': 40});
    decors.push({x: 420, y: 30, 'sprite': 'images/bush.png', 'qty': 1, 'isObstacle': true, 'width': 70, 'height': 40});
    decors.push({x: 305, y: 65, 'sprite': 'images/bush.png', 'qty': 1, 'isObstacle': true, 'width': 50, 'height': 28});
    decors.push({x: 420, y: 65, 'sprite': 'images/bush.png', 'qty': 1, 'isObstacle': true, 'width': 50, 'height': 28});
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
    for (var i = 0; i < 5; i++) {
        decors.push({
            x: 135,
            y: (180 + 32 * i),
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
        evils: [human, human2, human3, human4, human5, human6],
        goal: Box({x: 365, y: 20}, {width: 50, height: 50}, 'images/cave_2.png'),
        staticObjects: [horizontalTop, verticalLeft, horizontalBottom, verticalRight],
        decor: decors
    });


    // scenery is a singleton, so an object is created
    var sceneryCanvas = {};


    sceneryCanvas.draw = function () {
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, 505, 606);
        scenery.getAllBoxes().forEach(function (box) {
            ctx.drawImage(Resources.get(box.img), box.getPosition().x, box.getPosition().y, box.size.width, box.size.height);
        });
    };

    sceneryCanvas.tick = function () {
        scenery.tick();
        document.getElementById('player_lives').innerHTML = lives;
    };

    sceneryCanvas.keepDrawing = function () {
        if (scenery.isGameOn()) {
            sceneryCanvas.draw();
            sceneryCanvas.tick();
            window.requestAnimationFrame(function () {
                sceneryCanvas.keepDrawing();
            });
        } else if (scenery.isPlayerOnGoal()) {
            youWin();
        } else {
            gameOver();
        }
    };

    sceneryCanvas.keepDrawing();

    document.addEventListener('keyup', function (e) {
        var playerAction = {
            37: function () {
                scenery.leftAction();
            },
            38: function () {
                scenery.upAction();
            },
            39: function () {
                scenery.rightAction();
            },
            40: function () {
                scenery.downAction();
            }
        };
        playerAction[e.keyCode] && playerAction[e.keyCode]();
    });
};

Resources.onReady(game);
