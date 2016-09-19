
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
    var player = Box.createBox({x:200, y: 100}, {width: 50, height: 50}, '#FF0000');

    // enemies
    var human = Box.createBox({x:1, y: 300}, {width: 50, height: 50}, '#000');
    human.setVelocity({vx:2, vy: 0});
    var human2 = Box.createBox({x:3, y: 120}, {width: 50, height: 50}, '#000');
    human2.setVelocity({vx:0, vy: 0});
    human2.setVelocity({vx:0, vy: 0.5});

    // borders
    var horizontalTop = Box.createBox({x:0, y: -6}, {width:505, height:1}, '#FFBF00'); // amarillo
    var verticalLeft = Box.createBox({x:1, y: 0}, {width:1, height:606}, '#FF4C05'); // rojo
    var horizontalBottom = Box.createBox({x:0, y: 600}, {width:505, height:1}, '#B3C700'); // verde
    var verticalRight = Box.createBox({x:505, y: 0}, {width:1, height:606}, '#30ADF0'); // azul
    var test = Box.createBox({x: 250, y: 200}, {width:100, height:81}, '#6C0091'); // azul

    // world
    var scenery = new World({
        hero: player,
        evils: [human, human2],
        goal: Box.createBox({x:200, y: 200}, {width: 50, height: 50}, '#AABB11'),
        staticObjects: [horizontalTop, verticalLeft, horizontalBottom, verticalRight, test]
    });

    // scenery is a singleton, so an object is created
    var sceneryCanvas = {};


    sceneryCanvas.draw = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 606);
        scenery.getAllBoxes().forEach(function(box){
            ctx.strokeStyle = box.color;
            ctx.strokeRect(box.getPosition().x, (600 - box.getPosition().y - box.size.height), box.size.width, box.size.height);
            ctx.strokeRect(box.getPosition().x, (600 - box.getPosition().y), 5, 5);
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