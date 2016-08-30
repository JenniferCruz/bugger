
function World(obj) {
  this._hero = obj.hero;
  this._evils = obj.evils;
  this._initialHeroPosition = obj.initialHeroPosition;
  this._goal = obj.goal;
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

World.prototype._detectCollitions = function() {
	var hero = this._hero;
  var initialHeroPosition = this._initialHeroPosition;
  this._evils.forEach(function(evil) {
      if(hero.collides(evil)) {
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
