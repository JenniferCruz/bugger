
var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

// ctx.drawImage(Resources.get(this.sprite), this.startX, this.startY);


var gameOver = function(){
    ctx.strokeStyle='#FF0000';
    ctx.stroke();
    ctx.fillStyle = '#AABB11';
    ctx.rect(1, 1, 505, 506);
    ctx.fill();

    ctx.font = '100px Lucida Sans Unicode';
    ctx.fillStyle = '#000';
    ctx.fillText('Game',120,200);
    ctx.fillText('Over',150,300);
}


var game = function(){

    // Variables to set up scenery

    // hero
    var player = Box.createBox({x:20, y: 50});

    // enemies
    var human = Box.createBox({x:1, y: 300});
    human.setVelocity({vx:2, vy: 0});
    var human2 = Box.createBox({x:1, y: 120});
    human2.setVelocity({vx:0, vy: 0.5});

    // borders
    var horizontalTop = Box.createBox({x:0, y: 0}, {width:505, height:1});
    var verticalLeft = Box.createBox({x:0, y: 0}, {width:1, height:606});
    var horizontalBottom = Box.createBox({x:0, y: 606}, {width:505, height:1});
    var verticalRight = Box.createBox({x:505, y: 0}, {width:1, height:606});

    // world
    var scenery = new World({
        initialHeroPosition: {x:1, y:1},
        hero: player,
        evils: [human, human2],
        goal: Box.createBox({x:200, y: 200}),
        staticObjects: [horizontalTop, verticalLeft, horizontalBottom, verticalRight]
    });

    // scenery is a singleton, so an object is created
    var sceneryCanvas = {};


    sceneryCanvas.draw = function() {

        scenery.forEach(function(box) {

        });

        scenery.getEvils().forEach(function(character){
            ctx.strokeStyle='#000'; // DRAW BLACK ENEMIES
            ctx.strokeRect(character.getPosition().x, 600 - character.getPosition().y, character.size.width, character.size.height);
        });

        ctx.strokeStyle='#FF0000'; // DRAW RED HERO
        ctx.strokeRect(scenery.getHero().getPosition().x, 600 - scenery.getHero().getPosition().y, scenery.getHero().size.width, scenery.getHero().size.height);

        ctx.strokeStyle='#AABB11'; // DRAW GREENISH GOAL
        ctx.strokeRect(scenery.getGoal().getPosition().x, 600 - scenery.getGoal().getPosition().y, scenery.getGoal().size.width, scenery.getGoal().size.height);

        scenery._obstacles.forEach(function(obst){
            ctx.strokeStyle='#FFBF00'; // DRAW YELLOW BORDERS
            ctx.strokeRect(obst.getPosition().x, obst.getPosition().y, obst.size.width, obst.size.height);
        });
    };

    sceneryCanvas.tick = function() {
        scenery.tick();
    };

    sceneryCanvas.keepDrawing = function() {
        sceneryCanvas.draw();
        sceneryCanvas.tick();
        window.requestAnimationFrame(function(){ sceneryCanvas.keepDrawing();  });
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

game();