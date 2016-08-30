

var canvas = document.querySelector('canvas'),
     ctx = canvas.getContext('2d');

// ctx.drawImage(Resources.get(this.sprite), this.startX, this.startY);


//Singleton

var bug = new Box({x:5, y: 5});
var human = new Box({x:5, y: 5});
human.setVelocity({vx:0, vy: 1});

var scenery = new World({
  initialHeroPosition: {x:0, y:0},
  hero: bug,
  evils: [human, new Box({x:0, y:150})],
  goal: new Box({x:200, y: 200})
});

var sceneryCanvas = {
  // characters: [
  //     bug,
  //     human
  // ]
}

sceneryCanvas.draw = function() {
      scenery.getEvils().forEach(function(character){
          ctx.strokeRect(character.getPosition().x, 600 - character.getPosition().y, 50, 50);
      });
      ctx.strokeRect(scenery.getHero().getPosition().x, 600 - scenery.getHero().getPosition().y, 50, 50);
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
