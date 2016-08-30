

var canvas = document.querySelector('canvas'),
     ctx = canvas.getContext('2d');

// ctx.drawImage(Resources.get(this.sprite), this.startX, this.startY);


//Singleton

var bug = new Box({x:20, y: 50});

var human = new Box({x:1, y: 300});
human.setVelocity({vx:2, vy: 0});
var human2 = new Box({x:1, y: 100});
human2.setVelocity({vx:0, vy: 0.5});

var scenery = new World({
  initialHeroPosition: {x:1, y:1},
  hero: bug,
  evils: [human, human2],
  goal: new Box({x:200, y: 200})
});

var sceneryCanvas = {
}

sceneryCanvas.draw = function() {
      scenery.getEvils().forEach(function(character){
          ctx.strokeStyle='#000';
          ctx.strokeRect(character.getPosition().x, 600 - character.getPosition().y, 50, 50);
      });
      ctx.strokeStyle='#FF0000';
      ctx.strokeRect(scenery.getHero().getPosition().x, 600 - scenery.getHero().getPosition().y, 50, 50);
      ctx.strokeStyle='#AABB11';
      ctx.strokeRect(scenery.getGoal().getPosition().x, 600 - scenery.getGoal().getPosition().y, 50, 50);
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
  var hero = bug;
    var heroAction = {
        37: function() { hero.moveLeft(); } ,
        38: function() { hero.moveUp(); },
        39: function() { hero.moveRight(); },
        40: function() { hero.moveDown(); }
    };
    heroAction[e.keyCode] && heroAction[e.keyCode]();
});
