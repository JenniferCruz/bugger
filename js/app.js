

var canvas = document.querySelector('canvas'),
     ctx = canvas.getContext('2d');

// ctx.drawImage(Resources.get(this.sprite), this.startX, this.startY);


//Singleton

var bug = new Box({x:5, y: 5});
var human = new Box({x:5, y: 5});
human.setVelocity({vx:0, vy: 1});
var scenery = {
  characters: [
      bug,
      human
  ]
}

scenery.draw = function() {
      this.characters.forEach(function(character){
          ctx.strokeRect(character.getPosition().x, 600 - character.getPosition().y, 50, 50);
      });
}

scenery.tick = function() {
      this.characters.forEach(function(character){
          character.tick();
          if(character !== bug && bug.collides(character))
            bug.setPosition({x:5, y: 5});
      });
}

scenery.keepDrawing = function() {
   scenery.draw();
   scenery.tick();
   window.requestAnimationFrame(function(){ scenery.keepDrawing();  });
}

scenery.keepDrawing();

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
