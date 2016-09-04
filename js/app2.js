

var canvas = document.querySelector('canvas'),
     ctx = canvas.getContext('2d');

// ctx.drawImage(Resources.get(this.sprite), this.startX, this.startY);



// Variables to set up scenery

// hero
var player = Box.createHero({x:20, y: 50});

// enemies
var human = new Box({x:1, y: 300});
human.setVelocity({vx:2, vy: 0});
var human2 = new Box({x:1, y: 100});
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
  goal: new Box({x:200, y: 200}),
  staticObjects: [horizontalTop, verticalLeft, horizontalBottom, verticalRight]
});

// scenery is a singleton, so an object is created
var sceneryCanvas = {
}


sceneryCanvas.draw = function() {
    scenery.getEvils().forEach(function(character){
          ctx.strokeStyle='#000'; // DRAW BLACK ENEMIES
          ctx.strokeRect(character.getPosition().x, 600 - character.getPosition().y, character.size.width, character.size.height);
    });

    ctx.strokeStyle='#FF0000'; // DRAW RED HERO
    ctx.strokeRect(scenery.getHero().getPosition().x, 600 - scenery.getHero().getPosition().y, scenery.getHero().size.width, scenery.getHero().size.height);

    ctx.strokeStyle='#AABB11'; // DRAW GREENISH GOAL
    ctx.strokeRect(scenery.getGoal().getPosition().x, 600 - scenery.getGoal().getPosition().y, scenery.getGoal().size.width, scenery.getGoal().size.height);

    scenery._staticObjects.forEach(function(obst){
        ctx.strokeStyle='#FFBF00'; // DRAW YELLOW BORDERS
        ctx.strokeRect(obst.getPosition().x, obst.getPosition().y, obst.size.width, obst.size.height);
    });
}

sceneryCanvas.tick = function() {
      scenery.tick();
      if(scenery.isGoalReached()) console.log('Hurray!');
}

sceneryCanvas.keepDrawing = function() {
   sceneryCanvas.draw();
   sceneryCanvas.tick();
   window.requestAnimationFrame(function(){ sceneryCanvas.keepDrawing();  });
}

sceneryCanvas.keepDrawing();

document.addEventListener('keyup', function(e) {
  var hero = player;
    var heroAction = {
        37: function() { hero.moveLeft(); } ,
        38: function() { hero.moveUp(); },
        39: function() { hero.moveRight(); },
        40: function() { hero.moveDown(); }
    };
    heroAction[e.keyCode] && heroAction[e.keyCode]();
});
