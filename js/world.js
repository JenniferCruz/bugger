
/* http://www.w3schools.com/games/game_sound.asp */
function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };
}

var lives = 4;
var hitSound1 = new Sound('audio/dirt.wav');
var hitSound2 = new Sound('audio/minion_hit.wav');
var hitSound3 = new Sound('audio/bug.wav');
var hitSounds = [hitSound1, hitSound2, hitSound3];
var winningSound = new Sound('audio/achievement.wav');
var gameOverSound = new Sound('audio/fail.wav');

function World(obj) {
  this._hero = obj.hero;
  this._evils = obj.evils;
  this._initialHeroPosition = obj.hero.getPosition();
  this._goal = obj.goal;
  this._obstacles = obj.staticObjects || [];
  this._decor = [];

  for(var i = 0; i < obj.decor.length; i++){
      var decorSet = obj.decor[i];
      for(var j = 0; j < decorSet.qty; j++){
          var box = Box.createBox({x: (decorSet.x + j*decorSet.width), y: decorSet.y}, {width: decorSet.width || 60, height: decorSet.height || 80}, decorSet.sprite);
          if(decorSet.isObstacle === true)
              this._obstacles.push(box);
          else{
              this._decor.push(box);
          }
      }
  }
}


World.prototype.tick = function() {
	this._tickAllCharacters();
	this._detectCollitions();
};


World.prototype._tickAllCharacters = function() {
	//step for the hero and the evils
    this._hero.tick();
    this._evils.forEach(function(evil) {
        evil.tick();
    });
};


World.prototype.evilCollidesWithObstacles = function () {
    var obstacles = this._obstacles;
    this._evils.forEach(function(enemy){
        obstacles.forEach(function(obstacle){
            if(enemy.collides(obstacle)){
                var vel = enemy.getVelocity();
                enemy.setVelocity({vx: vel.vx * -1, vy: vel.vy * -1});
            }
        });
    });

};


World.prototype._detectCollitions = function() {
    this.heroCollidesWithEvils();
    this.evilCollidesWithObstacles();
    this.isPlayerOnGoal();
};


World.prototype.heroCollidesWithEvils = function() {
    var hero = this._hero;
    var initialHeroPosition = this._initialHeroPosition;
    this._evils.forEach(function (evil) {
        if (hero.collides(evil)) {
            hero.setPosition(initialHeroPosition);
            hitSounds[(lives%3)].play();
            lives--;
        }
    });
};


World.prototype.isPlayerOnGoal = function(){
  if(this._hero.collides(this._goal)){
      return true;
  }
  return false;
};


World.prototype.isGoalReached = function(){
  return this._hero.collides(this._goal);
};


World.prototype.getEvils = function(){
  //return Object.assign([], this._evils);
  return this._evils;
};


World.prototype.getHero = function(){
  return this._hero;
};


World.prototype.getGoal = function(){
  //return Object.assign({}, this._goal);
  return this._goal;
};

//
//var operation = {
//    '+': function(a, b){ return a + b;},
//    '-': function(a, b){ return a - b;}
//};

World.prototype.getAllBoxes = function () {
    var boxes = [];
    return boxes.concat(this._decor).concat(this._obstacles).concat(this._goal).concat(this._evils).concat(this._hero);
}

/*
* PLAYER LEFT ACTION
* */
_obstacleHeightOverlapsPlayer  = function(obstacle, player){
    return obstacle.getPosition().y + obstacle.size.height < player.getPosition().y
        || obstacle.getPosition().y > player.getPosition().y + player.size.height;
};

World.prototype._getObstaclesOnTheLeft = function(){
    var obstaclesXs = [];
    var obstaclesOnTheLeft = [];
    var player = this._hero;
    this._obstacles.forEach(function(obst){
        var obstacleIsOnTheWay = (obst.getPosition().x + obst.size.width < player.getPosition().x) &&
            !_obstacleHeightOverlapsPlayer(obst, player);

        if(obstacleIsOnTheWay){
            obstaclesXs.push(obst.getPosition().x + obst.size.width);
            obstaclesOnTheLeft.push(obst);
        }
    });
  return obstaclesXs;
};


World.prototype._getMovingSpeedLeft = function(){
    var closestObstacleX = Math.max.apply(null, this._getObstaclesOnTheLeft());
    var moveSpeed = 20;

    while(this._hero.getPosition().x - moveSpeed <= closestObstacleX){
        moveSpeed--;
    }
    return moveSpeed;
};


World.prototype.leftAction = function(){
    var moveSpeed = this._getMovingSpeedLeft();
    this._hero.move({vx: -moveSpeed, vy:0});
};


/*
* PLAYER RIGHT ACTION
* */

World.prototype._getRightObstaclesXs = function(){
    var obstaclesXs = [];
    //var obstaclesOnTheRight = [];
    var player = this._hero;

    this._obstacles.forEach(function(obst){
        var obstacleIsOnTheWay = (obst.getPosition().x > player.size.width + player.getPosition().x) &&
            !(_obstacleHeightOverlapsPlayer(obst, player));

        if(obstacleIsOnTheWay){
            obstaclesXs.push(obst.getPosition().x);
            //obstaclesOnTheRight.push(obst);
        }
    });
    return obstaclesXs;
};

World.prototype._getMovingSpeedRight = function(){
    var closestObstacleX = Math.min.apply(null, this._getRightObstaclesXs());
    var moveSpeed = 20;

    while(this._hero.getPosition().x + this._hero.size.width + moveSpeed >= closestObstacleX){
        moveSpeed--;
    }
    return moveSpeed;
};


World.prototype.rightAction = function(){
    var moveSpeed = this._getMovingSpeedRight();
    this._hero.move({vx: moveSpeed, vy:0});
};


/*
 * PLAYER DOWN ACTION
 * */


_obstacleWidthOverlapsPlayer  = function(obstacle, player){
    return obstacle.getPosition().x + obstacle.size.width < player.getPosition().x
        || obstacle.getPosition().x > player.getPosition().x + player.size.width;
};
//_obstacleWidthOverlapsPlayer  = function(obstacle, player){
//    return obstacle.getPosition().x + obstacle.size.width < player.getPosition().x
//        || obstacle.getPosition().x > player.getPosition().x + player.size.width;
//};

World.prototype._getObstaclesBelowYs = function(){
    var obstaclesYs = [];
    var obstOnTheWay = [];
    var player = this._hero;

    this._obstacles.forEach(function(obst){
        var overlap = 0; // <|
        var obstacleIsOnTheWay = (obst.getPosition().y + obst.size.height - overlap > player.getPosition().y) &&
            !_obstacleWidthOverlapsPlayer(obst, player);
        if(obstacleIsOnTheWay){
            obstaclesYs.push(obst.getPosition().y);
            obstOnTheWay.push(obst);
        }
    });
    return obstaclesYs;
};


World.prototype._getMovingSpeedDown = function(){
    var closestObstacleY = Math.min.apply(null, this._getObstaclesBelowYs());
    var moveSpeed = 20;
    var overlap = 0; // <<|
    while(this._hero.getPosition().y + this._hero.size.height - overlap + moveSpeed >= closestObstacleY){
        moveSpeed--;
    }
    return moveSpeed;
};


World.prototype.downAction = function(){
    var moveSpeed = this._getMovingSpeedDown();
    this._hero.move({vx: 0, vy:moveSpeed});
};

/*
 * PLAYER UP ACTION
 * */
World.prototype._getObstaclesAboveYs = function(){
    var obstaclesYs = [];
    var player = this._hero;

    this._obstacles.forEach(function(obst){
        var obstacleIsOnTheWay = (obst.getPosition().y < player.getPosition().y + player.size.height) &&
            !(_obstacleWidthOverlapsPlayer(obst, player));

        if(obstacleIsOnTheWay){
            obstaclesYs.push(obst.getPosition().y + obst.size.height);
        }
    });

    return obstaclesYs;
};

World.prototype._getMovingSpeedUp = function(){
    var closestObstacleY = Math.max.apply(null, this._getObstaclesAboveYs());
    var moveSpeed = 20;
    while(this._hero.getPosition().y - moveSpeed <= closestObstacleY){
        moveSpeed--;
    }
    return moveSpeed;
};

World.prototype.upAction = function(){
    var moveSpeed = this._getMovingSpeedUp();
    this._hero.move({vx: 0, vy:-moveSpeed});
};



World.prototype.isGameOn = function(){
    return lives > 0 && !this.isPlayerOnGoal();
};