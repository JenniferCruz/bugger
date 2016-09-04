
function World(obj) {
  this._hero = obj.hero;
  this._evils = obj.evils;
  this._initialHeroPosition = obj.hero.getPosition();
  this._goal = obj.goal;
  this._staticObjects = obj.staticObjects || [];
}


World.prototype.tick = function() {
	this._tickAllCharacters();
	this._detectCollitions();
}

World.prototype._tickAllCharacters = function() {
	//step for the hero and the evils
    this._hero.tick();
    this._evils.forEach(function(evil) {
        evil.tick();
    });
}

World.prototype.evilCollidesWithObstacles = function () {
    var obstacles = this._staticObjects;
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

    /**this.heroReachesGoal();
    this.boxCollidesWithBoundaries();
     */

   this.heroCollidesWithEvils();
   this.evilCollidesWithObstacles();
   //this.heroCollidesWithObstacles();
   //this.isGoalReached();

}

World.prototype.heroCollidesWithEvils = function() {
    var hero = this._hero;
    var initialHeroPosition = this._initialHeroPosition;
    this._evils.forEach(function (evil) {
        if (hero.collides(evil)) {
            hero.setPosition(initialHeroPosition);
        }
    });
}

World.prototype.isGoalReached = function(){
  return this._hero.collides(this._goal);
}

World.prototype.getEvils = function(){
  //return Object.assign([], this._evils);
  return this._evils;
}

World.prototype.getHero = function(){
  return this._hero;
}

World.prototype.getGoal = function(){
  //return Object.assign({}, this._goal);
  return this._goal;
}

World.prototype.getInitialHeroPosition = function(){
  return Object.assign({}, this._initialHeroPosition);
}
