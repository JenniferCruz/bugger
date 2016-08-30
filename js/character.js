var MOVING_SPEED = 20;
var RANGE_X = [0,455];
var RANGE_Y = [600,44];

function Box(point, size) {
   this._position = point;
   this.velocity = {vx: 0, vy: 0};
   this.size = size || {width: 50, height: 50};
}

Box.prototype.moveRight = function() {
  this.move({vx: MOVING_SPEED, vy:0});
}
Box.prototype.moveLeft = function() {
    this.move({vx: -MOVING_SPEED, vy:0});
}
Box.prototype.moveUp = function() {
    this.move({vx: 0, vy:MOVING_SPEED});
}
Box.prototype.moveDown = function() {
  this.move({vx: 0, vy:-MOVING_SPEED});
}
Box.prototype.move = function(incrementPosition) {
    this.setVelocity(incrementPosition);
    this.tickManual();
    // this.tick();
    this.stop();
}
Box.prototype.stop = function() {
   this.setVelocity({vx:0, vy: 0});
}
Box.prototype.setVelocity = function(velocity) {
     this.velocity = velocity;
}



Box.prototype.tick = function() {
  this._position.x += this.velocity.vx;
  this._position.y += this.velocity.vy;
}

Box.prototype.tickAuto = function(){
  if(this._position.x >= RANGE_X[1] || this._position.x <= 0)
    this.velocity.vx *= -1;
  if(this._position.y >= RANGE_Y[0] || this._position.y <= 40)
    this.velocity.vy *= -1;
  this._position.x += this.velocity.vx;
  this._position.y += this.velocity.vy;
}

Box.prototype.tickManual = function(){
  if(this._position.x > RANGE_X[1]){
    this._position.x = RANGE_X[1];
  }
  if(this._position.x < 0){
    this._position.x = 0;
  }
  if(this._position.y > RANGE_Y[0]){
    this._position.y = RANGE_Y[0];
  }
  if(this._position.y < 40){
    this._position.y = 40;
  }
  this._position.x += this.velocity.vx;
  this._position.y += this.velocity.vy;
}




Box.prototype.collides = function(other) {
    return (other._position.x >= this._position.x && other._position.x <=  this._position.x + this.size.width)
            &&  (other._position.y >= this._position.y && other._position.y <=  this._position.y + this.size.height)
}

Box.prototype.getPosition = function(){
  return Object.assign({}, this._position);
}

Box.prototype.setPosition = function(point){
  this._position = Object.assign({}, point);
}
