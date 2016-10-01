// TODO: [required] Add functionality when goal is reached / WINNING RESULT!
// TODO: [optional] Add sound effect on collisions with shoes
// TODO: [optional] Display how many lives are left
// TODO: [required] Style game over screen
// TODO: [optional] Add 2 or 3 additional levels


var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

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
    'images/cinderella-shoe.png',
    'images/boot.png',
    'images/foot.png',
    'images/rubber-sandals.png',
    'images/tennis.png',
    'images/loafer.png',
    'images/log.png',
    'images/mushroom.png',
    'images/player_bee.png',
    'images/player_grasshopper.png',
    'images/stone-block.png',
    'images/bonfire.png',
    'images/tulips.png',
    'images/tulips_top.png',
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
    var player = Box.createBox({x:30, y: 520}, {width: 50, height: 50}, 'images/player_bee.png');

    // enemies
    var human = Box.createBox({x:21, y: 230}, {width: 50, height: 19}, 'images/rubber-sandals.png');
    human.setVelocity({vx:0.4, vy: 0});
    var human2 = Box.createBox({x:21, y: 385}, {width: 50, height: 31}, 'images/tennis.png');
    human2.setVelocity({vx:1, vy: 0});
    var human3 = Box.createBox({x:25, y: 45}, {width: 50, height: 44}, 'images/cinderella-shoe.png');
    human3.setVelocity({vx:0.4, vy: 0});
    var human4 = Box.createBox({x:200, y: 100}, {width: 50, height: 50}, 'images/boot.png');
    human4.setVelocity({vx:1, vy: 0});
    var human5 = Box.createBox({x:200, y: 250}, {width: 50, height: 30}, 'images/foot.png');
    human5.setVelocity({vx:1, vy: 0});
    var human6 = Box.createBox({x:400, y: 470}, {width: 50, height: 18}, 'images/loafer.png');
    human6.setVelocity({vx:1, vy: 0});

    // borders
    var horizontalTop= Box.createBox({x:0, y: 0}, {width:505, height:40}, 'images/forest_2.png');
    var horizontalBottom = Box.createBox({x:5, y: 585}, {width:495, height:20}, 'images/fence_2.png');
    var verticalLeft = Box.createBox({x:0, y: 35}, {width:20, height:565}, 'images/fence_left.png');
    var verticalRight = Box.createBox({x:485, y: 35}, {width:20, height:565}, 'images/fence_left.png');

    // decor and obstacles
    var decors = [];
    for(var i = 0; i < 20; i++){
        decors.push({x: 0, y: i*30, 'sprite': 'images/grass-block.png', 'qty': 11, 'width':50, 'height':50});
    }
    decors.push({x: 290, y: 30, 'sprite': 'images/bush.png', 'qty': 1, 'isObstacle': true, 'width':70, 'height':40});
    decors.push({x: 420, y: 30, 'sprite': 'images/bush.png', 'qty': 1, 'isObstacle': true, 'width':70, 'height':40});
    decors.push({x: 305, y: 65, 'sprite': 'images/bush.png', 'qty': 1, 'isObstacle': true, 'width':50, 'height':28});
    decors.push({x: 420, y: 65, 'sprite': 'images/bush.png', 'qty': 1, 'isObstacle': true, 'width':50, 'height':28});
    decors.push({x: 360, y: 170, 'sprite': 'images/bonfire.png', 'qty': 1, 'isObstacle': true, 'width':65, 'height':65});
    decors.push({x: 120, y: 100, 'sprite': 'images/fountain.png', 'qty': 1, 'isObstacle': true, 'width':80, 'height':80});
    for(var i = 0; i < 5; i++){
        decors.push({x: 135, y: (180+32*i), 'sprite': 'images/water-block.png', 'qty': 1, 'isObstacle': true, 'width':50, 'height':50});
    }
    decors.push({x: 300, y: 365, 'sprite': 'images/stone-block.png', 'qty': 2, 'isObstacle': true, 'width':50, 'height':50});
    decors.push({x: 300, y: 398, 'sprite': 'images/stone-block.png', 'qty': 2, 'isObstacle': true, 'width':50, 'height':50});
    decors.push({x: 260, y: 355, 'sprite': 'images/tulips.png', 'qty': 1, 'isObstacle': true, 'width':50, 'height':50});
    decors.push({x: 260, y: 400, 'sprite': 'images/tulips.png', 'qty': 1, 'isObstacle': true, 'width':50, 'height':50});
    decors.push({x: 390, y: 355, 'sprite': 'images/tulips.png', 'qty': 1, 'isObstacle': true, 'width':50, 'height':50});
    decors.push({x: 390, y: 400, 'sprite': 'images/tulips.png', 'qty': 1, 'isObstacle': true, 'width':50, 'height':50});

    // world
    var scenery = new World({
        hero: player,
        evils: [human, human2, human3, human4, human5, human6],
        goal: Box.createBox({x:365, y: 20}, {width: 50, height: 50}, 'images/cave_2.png'),
        staticObjects: [horizontalTop, verticalLeft, horizontalBottom, verticalRight],
        decor: decors
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
            ctx.drawImage(Resources.get(box.color), box.getPosition().x,  box.getPosition().y, box.size.width, box.size.height);
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
            40: function() {  scenery.downAction(); }
        };
        playerAction[e.keyCode] && playerAction[e.keyCode]();
    });
};

Resources.onReady(game);

//game();