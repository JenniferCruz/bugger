
var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

// ctx.drawImage(Resources.get(this.sprite), this.startX, this.startY);

Resources.load([
    'images/boat-2.png',
    'images/bush.png',
    'images/cave_2.png',
    'images/char-boy.png',
    'images/fence_right.png',
    'images/fence_left.png',
    'images/fountain.png',
    'images/fence_2.png',
    'images/forest_2.png',
    'images/grass-block.png',
    'images/grass.png',
    'images/high-heels.png',
    'images/log.png',
    'images/mushroom.png',
    'images/player_bee.png',
    'images/player_grasshopper.png',
    'images/stone-block.png',
    'images/tennis.png',
    'images/tulips.png',
    'images/water-block.png'
]);

var gameOver = function(){
    ctx.strokeStyle='#FF0000';
    ctx.stroke();
    ctx.fillStyle = '#AABB11';
    ctx.rect(1, 1, 505, 606);
    ctx.fill();

    ctx.font = '100px Lucida Sans Unicode';
    ctx.fillStyle = '#000';
    ctx.fillText('Game',120,200);
    ctx.fillText('Over',150,300);
}


var game = function(){

    // Variables to set up scenery

    // hero
    var player = Box.createBox({x:200, y: 100}, {width: 50, height: 50}, 'images/player_bee.png');

    // enemies
    var human = Box.createBox({x:21, y: 300}, {width: 50, height: 50}, 'images/high-heels.png');
    human.setVelocity({vx:0.2, vy: 0});
    var human2 = Box.createBox({x:22, y: 120}, {width: 50, height: 50}, 'images/tennis.png');
    human2.setVelocity({vx:0, vy: 0});
    //human2.setVelocity({vx:0, vy: 0.5});

    // borders
    var horizontalBottom= Box.createBox({x:0, y: 14}, {width:505, height:20}, 'images/fence_2.png');
    var horizontalTop = Box.createBox({x:0, y: 600}, {width:505, height:40}, 'images/forest_2.png');
    var verticalLeft = Box.createBox({x:0, y: 0}, {width:1, height:606}, 'images/fence_left.png'); // TODO:
    //var verticalLeft = Box.createBox({x:50, y: 600}, {width:50, height:606}, 'images/fence_left.png'); // TODO:
    var verticalRight = Box.createBox({x:490, y: 0}, {width:1, height:606}, 'images/fence_left.png'); // TODO: :(
    var test = Box.createBox({x: -300, y: 459}, {width:60, height:81}, 'images/fountain.png');// TODO: remove

    // world
    var scenery = new World({
        hero: player,
        evils: [human, human2],
        goal: Box.createBox({x:365, y: 570}, {width: 50, height: 50}, 'images/cave_2.png'),
        staticObjects: [horizontalTop, verticalLeft, horizontalBottom, verticalRight, test],
        decor: [{x: 0, y: 610, 'sprite': 'images/grass-block.png', 'qty': 10},
            {x: 0, y: 549, 'sprite': 'images/water-block.png', 'qty': 6, 'isObstacle': true},
            {x: 360, y: 549, 'sprite': 'images/stone-block.png', 'qty': 1, 'isObstacle': false},
            {x: 420, y: 549, 'sprite': 'images/water-block.png', 'qty': 2, 'isObstacle': true},
            {x: 0, y: 499, 'sprite': 'images/water-block.png', 'qty': 6, 'isObstacle': true},
            {x: 360, y: 499, 'sprite': 'images/stone-block.png', 'qty': 2, 'isObstacle': false},
            {x: 480, y: 499, 'sprite': 'images/water-block.png', 'qty': 1, 'isObstacle': true},
            {x: 435, y: 499, 'sprite': 'images/mushroom.png', 'qty': 1, 'isObstacle': true, 'width':50, 'height':51},
            {x: 300, y: 469, 'sprite': 'images/mushroom.png', 'qty': 1, 'isObstacle': true},
            {x: 280, y: 419, 'sprite': 'images/mushroom.png', 'qty': 1, 'isObstacle': true, 'width':50, 'height':51},
            {x: 445, y: 310, 'sprite': 'images/bush.png', 'qty': 1, 'isObstacle': true, 'width':80, 'height':80},
            {x: 405, y: 280, 'sprite': 'images/bush.png', 'qty': 1, 'isObstacle': true, 'width':80, 'height':80},
            {x: 445, y: 250, 'sprite': 'images/tulips.png', 'qty': 1, 'isObstacle': true, 'width':80, 'height':80},
            {x: 0, y: 459, 'sprite': 'images/grass-block.png', 'qty': 10},
            {x: 0, y: 409, 'sprite': 'images/grass-block.png', 'qty': 10},
            {x: 0, y: 359, 'sprite': 'images/grass-block.png', 'qty': 10},
            {x: 0, y: 309, 'sprite': 'images/grass-block.png', 'qty': 10},
            {x: 0, y: 259, 'sprite': 'images/grass-block.png', 'qty': 10},
            {x: 0, y: 209, 'sprite': 'images/grass-block.png', 'qty': 10},
            {x: 0, y: 159, 'sprite': 'images/grass-block.png', 'qty': 10},
            {x: 0, y: 109, 'sprite': 'images/grass-block.png', 'qty': 10},
            {x: 0, y: 59, 'sprite': 'images/grass-block.png', 'qty': 10}]
    });

    // scenery is a singleton, so an object is created
    var sceneryCanvas = {};


    sceneryCanvas.draw = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 606);
        //console.log(scenery.getAllBoxes());
        scenery.getAllBoxes().forEach(function(box){
            //ctx.strokeStyle = box.color;
            //ctx.strokeRect(box.getPosition().x, (600 - box.getPosition().y - box.size.height), box.size.width, box.size.height);
            //ctx.strokeRect(box.getPosition().x, (600 - box.getPosition().y), 5, 5);
            ctx.drawImage(Resources.get(box.color), box.getPosition().x, (600 - box.getPosition().y), box.size.width, box.size.height);
        });
    };

    sceneryCanvas.tick = function() {
        scenery.tick();
    };

    sceneryCanvas.keepDrawing = function() {
        if(scenery.isGameOn()){
            sceneryCanvas.draw();
            sceneryCanvas.tick();
            window.requestAnimationFrame(function(){ sceneryCanvas.keepDrawing();  });
        } else {
            gameOver();
        }
    };

    sceneryCanvas.keepDrawing();

    document.addEventListener('keyup', function(e) {
        var playerAction = {
            37: function() { scenery.leftAction(); } ,
            38: function() { scenery.upAction(); },
            39: function() { scenery.rightAction(); },
            40: function() { scenery.downAction(); }
        };
        playerAction[e.keyCode] && playerAction[e.keyCode]();
    });
};

Resources.onReady(game);

//game();