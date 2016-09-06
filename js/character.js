
var RANGE_X = [0,455];
var RANGE_Y = [600,44];


function Box(point, size) {
    var obj = {};
    obj._position = point;
    obj.velocity = {vx: 0, vy: 0};
    obj.size = size || {width: 50, height: 50};


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

    /**
     * mas o menos Evil.thick()
     * if(
     */
   //obj.tickAuto = function(){
   //     if(this._position.x >= RANGE_X[1] || this._position.x <= 0)
   //         this.velocity.vx *= -1;
   //     if(this._position.y >= RANGE_Y[0] || this._position.y <= 40)
   //         this.velocity.vy *= -1;
   //     this._position.x += this.velocity.vx;
   //     this._position.y += this.velocity.vy;
   // }

    /**
     * tryToMove(potentialCollitioners) {
     *     collides with any element in potentialCollision?
      *     return false;
      *
      *     return true
     *  }
     *
     */
   //
   //obj.tickManual = function(){
   //     //
   //     if(this._position.x > RANGE_X[1]){
   //         this._position.x = RANGE_X[1];
   //     }
   //     if(this._position.x < 0){
   //         this._position.x = 0;
   //     }
   //     if(this._position.y > RANGE_Y[0]){
   //         this._position.y = RANGE_Y[0];
   //     }
   //     if(this._position.y < 40){
   //         this._position.y = 40;
   //     }
   //     this._position.x += this.velocity.vx;
   //     this._position.y += this.velocity.vy;
   // }

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


function Hero(point, size) {
    var obj = Box.createBox(point, size);
    return obj;
}

Box.createBox = function(point, size) {
     return Box(point, size);
}

Box.createHero = function (point, size) {
    return Hero(point, size); //Box.createBox(point,size);
};

