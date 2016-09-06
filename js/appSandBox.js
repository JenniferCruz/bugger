

var canvas = document.querySelector('canvas'),
     ctx = canvas.getContext('2d');

//Hero
var bug = Box.createHero({x:0, y:0},{width:21, height:21});
//Enemies
var human = Box.createBox({x:20, y: 20});
//human.setVelocity({vx:2, vy: 0});
var human2 = Box.createBox({x:401, y: 100});
//human2.setVelocity({vx:0, vy: 0.5});
//World
var scenery = new World({
  hero: bug,
  evils: [human, human2],
  goal: Box.createBox({x:200, y: 200}),
  //staticObjects: [Box.createBox({x: 20, y: 20}, {width:10, height:606})]
  staticObjects: [Box.createBox({x: 450, y: 600}, {width:10, height:606})]
});

var sceneryCanvas = {}

sceneryCanvas.draw = function() {
      scenery.getEvils().forEach(function(character){
          ctx.strokeStyle='#000';
          //ctx.strokeRect(character.getPosition().x, character.getPosition().y, 50, 50);
          ctx.strokeRect(character.getPosition().x, 600 - character.getPosition().y, 50, 50);
          console.log(character.collides(scenery._obstacles[0]));
      });
      ctx.strokeStyle='#FF0000';
      //ctx.strokeRect(scenery.getHero().getPosition().x, scenery.getHero().getPosition().y, 50, 50);
      ctx.strokeRect(scenery.getHero().getPosition().x, 600 - scenery.getHero().getPosition().y, 50, 50);
      ctx.strokeStyle='#AABB11';
      //ctx.strokeRect(scenery.getGoal().getPosition().x, scenery.getGoal().getPosition().y, 50, 50);
      ctx.strokeRect(scenery.getGoal().getPosition().x, 600 - scenery.getGoal().getPosition().y, 50, 50);
      ctx.strokeStyle='#F0C60B';
      scenery._obstacles.forEach(function (obstacle) {
         ctx.strokeRect(obstacle.getPosition().x, 600 - obstacle.getPosition().y, obstacle.size.width, obstacle.size.height);
         //ctx.strokeRect(obstacle.getPosition().x, obstacle.getPosition().y, obstacle.size.width, obstacle.size.height);
      });
}

sceneryCanvas.keepDrawing = function() {
    sceneryCanvas.draw();
    //sceneryCanvas.tick();
    window.requestAnimationFrame(function(){ sceneryCanvas.keepDrawing();  });
}

//sceneryCanvas.tick = function() {
//      scenery.tick();
//      if(scenery.isGoalReached()) console.log('Hurray!');
//}


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
