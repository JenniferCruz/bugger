
var RANGE_X = [0,455];
var RANGE_Y = [600,44];


function Box(point, size, color) {
    var obj = {};
    obj._position = point;
    obj.velocity = {vx: 0, vy: 0};
    obj.size = size,// || {width: 50, height: 50};
    obj.color = color;

    obj.move = function(incrementPosition) {
        this._position.x += incrementPosition.vx;
        this._position.y += incrementPosition.vy;
    }

   obj.stop = function() {
        this.setVelocity({vx:0, vy: 0});
    }

   obj.setVelocity = function(velocity) {
        this.velocity = velocity;
    }

   obj.tick = function() {
       obj.move(this.velocity);
    }
    

   obj.collides = function(other) {
        return !(this._position.x + this.size.width < other._position.x || this._position.x > other._position.x + other.size.width) &&
            !(this._position.y + this.size.height < other._position.y || this._position.y > other._position.y + other.size.height);
   }


   obj.getPosition = function(){
        return Object.assign({}, this._position);
    }


   obj.setPosition = function(point){
        this._position = Object.assign({}, point);
    }

    // NOT DIRECTLY COVERED YET
    obj.getVelocity = function(){
        return Object.assign({}, this.velocity);
    }

    return obj;
}


Box.createBox = function(point, size, color) {
     return Box(point, size, color);
}

