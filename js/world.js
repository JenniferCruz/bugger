var lives = 3;

function World(obj) {
  this._hero = obj.hero;
  this._evils = obj.evils;
  this._initialHeroPosition = obj.hero.getPosition();
  this._goal = obj.goal;
  this._obstacles = obj.staticObjects || [];
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
    this.managePlayer();
};


World.prototype.heroCollidesWithEvils = function() {
    var hero = this._hero;
    var initialHeroPosition = this._initialHeroPosition;
    this._evils.forEach(function (evil) {
        if (hero.collides(evil)) {
            hero.setPosition(initialHeroPosition);
            lives--;
        }
    });
};


World.prototype.managePlayer = function(){
  if(this._hero.collides(this._goal)){
      console.log('Reached goal! What now?');
  }
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
    return boxes.concat(this._evils).concat(this._hero).concat(this._goal).concat(this._obstacles);
}

/*
* PLAYER LEFT ACTION
* */

World.prototype._getObstaclesOnTheLeft = function(){
    var obstaclesXs = [];
    var obstaclesOnTheLeft = [];
    var player = this._hero;
    this._obstacles.forEach(function(obst){
        var obstacleIsOnTheWay = (obst.getPosition().x + obst.size.width < player.getPosition().x) &&
            !(obst.getPosition().y + obst.size.height < player.getPosition().y || obst.getPosition().y > player.getPosition().y + player.size.height);

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
    var obstaclesOnTheRight = [];
    var player = this._hero;

    this._obstacles.forEach(function(obst){
        var obstacleIsOnTheWay = (obst.getPosition().x > player.size.width + player.getPosition().x) &&
            !(obst.getPosition().y + obst.size.height < player.getPosition().y || obst.getPosition().y > player.getPosition().y + player.size.height);

        if(obstacleIsOnTheWay){
            obstaclesXs.push(obst.getPosition().x);
            obstaclesOnTheRight.push(obst);
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
 * PLAYER UP ACTION
 * */


World.prototype._getObstaclesAboveYs = function(){
    var obstaclesYs = [];
    var obstAbove = [];
    var player = this._hero;

    this._obstacles.forEach(function(obst){
        var obstacleIsOnTheWay = (obst.getPosition().y + obst.size.height > player.getPosition().y) &&
            !(obst.getPosition().x + obst.size.width < player.getPosition().x || obst.getPosition().x > player.getPosition().x + player.size.width);
        if(obstacleIsOnTheWay){
            obstaclesYs.push(obst.getPosition().y);
            obstAbove.push(obst);
        }
    });
    return obstaclesYs;
};


World.prototype._getMovingSpeedUp = function(){
    var closestObstacleY = Math.min.apply(null, this._getObstaclesAboveYs());
    var moveSpeed = 20;

    while(this._hero.getPosition().y + this._hero.size.height + moveSpeed >= closestObstacleY){
        moveSpeed--;
    }
    return moveSpeed;
};


World.prototype.upAction = function(){
    var moveSpeed = this._getMovingSpeedUp();
    this._hero.move({vx: 0, vy:moveSpeed});
};


/*
 * PLAYER DOWN ACTION
 * */
World.prototype._getObstaclesBelowYs = function(){
    var obstaclesYs = [];
    var player = this._hero;

    this._obstacles.forEach(function(obst){
        var obstacleIsOnTheWay = (obst.getPosition().y < player.getPosition().y + player.size.height) &&
            !(obst.getPosition().x + obst.size.width < player.getPosition().x || obst.getPosition().x > player.getPosition().x + player.size.width);

        if(obstacleIsOnTheWay){
            obstaclesYs.push(obst.getPosition().y + obst.size.height);
        }
    });

    return obstaclesYs;
};

World.prototype._getMovingSpeedDown = function(){
    var closestObstacleY = Math.max.apply(null, this._getObstaclesBelowYs());
    var moveSpeed = 20;
    while(this._hero.getPosition().y - moveSpeed <= closestObstacleY){
        moveSpeed--;
    }
    return moveSpeed;
};

World.prototype.downAction = function(){
    var moveSpeed = this._getMovingSpeedDown();
    this._hero.move({vx: 0, vy:-moveSpeed});
};





World.prototype.isGameOn = function(){
    return lives > 0;
};