/**
 * This class was developed to allow functional inheritance.
 * However, I ended up not using inheritance.
 */

/**
 * @description All entities within world are represented as a Box instance.
 * This includes hero character, enemies, obstacles and boundaries
 * @param {object} point - with x and y numerical values
 * @param {object} size - with width and height numerical values
 * @param {string} img - an url to the image that represents the box
 * */
function Box(point, size, img) {
    var obj = {};
    obj._position = point;
    obj.velocity = {vx: 0, vy: 0};
    obj.size = size || {width: 50, height: 50};
    obj.img = img;

    /**
     * @description Changes (x, y) position of box
     * @param {object} incrementPosition - with vx and vy numerical values
     * */
    obj.move = function(incrementPosition) {
        this._position.x += incrementPosition.vx;
        this._position.y += incrementPosition.vy;
    };

   obj.stop = function() {
        this.setVelocity({vx:0, vy: 0});
    };

   /**
    * @param {object} velocity - with vx and vy numerical values
    * */
   obj.setVelocity = function(velocity) {
        this.velocity = velocity;
    };

   /**
    * @description Move box with its current velocity
    * */
   obj.tick = function() {
       obj.move(this.velocity);
    };

   /**
    * @param {Box} other - another box
    * @returns {boolean} whether this box and other box collide
    * */
   obj.collides = function(other) {
        return !(this._position.x + this.size.width < other._position.x || this._position.x > other._position.x + other.size.width) &&
            !(this._position.y + this.size.height < other._position.y || this._position.y > other._position.y + other.size.height);
   };

   obj.getPosition = function(){
        return Object.assign({}, this._position);
    };

   obj.setPosition = function(point){
        this._position = Object.assign({}, point);
    };

    obj.getVelocity = function(){
        return Object.assign({}, this.velocity);
    };

    return obj;
}

// TODO: keep constructor factory?
Box.createBox = function(point, size, color) {
     return new Box(point, size, color);
};

