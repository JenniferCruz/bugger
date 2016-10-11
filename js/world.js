/*
* This class puts together everything that makes up a world in a game.
* It keeps track of the characters (good and bad) and information about all decorative elements, obstacles and goal.
* Additionally, it implements all functions related to how those elements interact with one another.
* This should be your class if you are trying to adjust things like collisions between elements in the canvas,
* managing user input, player's lives and whether the goal was reached or not.
*/

var lives = 4;
var HIT_SOUND = [new Sound('audio/dirt.wav'), new Sound('audio/minion_hit.wav'), new Sound('audio/bug.wav')];
var WINNING_SOUND = new Sound('audio/achievement.wav');
var GAME_OVER_SOUND = new Sound('audio/fail.wav');

/**
 * @constructor
 * @param {object} obj - contains various objects:
 *          hero - box object
 *          evils - array of box objects
 *          goal - box object
 *          staticObjects - array of box objects that represent obstacles
 *          decor - arrays of objects with information to create decor objects and/or additional obstacles in bulk.
 *          TODO: How can I get this better?
 * */
function World(obj) {
    this._hero = obj.hero;
    this._evils = obj.evils;
    this._initialHeroPosition = obj.hero.getPosition();
    this._goal = obj.goal;
    this._obstacles = obj.staticObjects || [];
    this._decor = [];
    // iterate over decor parameter to create additional box objects
    for (var i = 0; i < obj.decor.length; i++) {
        var decorSet = obj.decor[i];
        for (var j = 0; j < decorSet.qty; j++) {
            var box = Box({
                x: (decorSet.x + j * decorSet.width),
                y: decorSet.y
            }, {
                width: decorSet.width || 60,
                height: decorSet.height || 80
            }, decorSet.sprite);
            if (decorSet.isObstacle === true)
                this._obstacles.push(box);
            else {
                this._decor.push(box);
            }
        }
    }
}

/**
 * @description move hero and enemies and check for potential collisions
 * */
World.prototype.tick = function() {
    this._tickAllCharacters();
    this._detectCollitions();
};

/**
 * @description move hero and enemies one step
 * */
World.prototype._tickAllCharacters = function() {
    this._hero.tick();
    this._evils.forEach(function(evil) {
        evil.tick();
    });
};


World.prototype._detectCollitions = function() {
    this._heroCollidesWithEvils();
    this._evilCollidesWithObstacles();
};

/**
 * @description change enemies direction if they collide with an obstacle.
 * */
World.prototype._evilCollidesWithObstacles = function() {
    var obstacles = this._obstacles;
    this._evils.forEach(function(enemy) {
        obstacles.forEach(function(obstacle) {
            if (enemy.collides(obstacle)) {
                var vel = enemy.getVelocity();
                enemy.setVelocity({
                    vx: vel.vx * -1,
                    vy: vel.vy * -1
                });
            }
        });
    });

};

/**
 * @description manage behaviour when hero collides with an enemy:
 * decrease live, play a sound and move hero back to initial position.
 * */
World.prototype._heroCollidesWithEvils = function() {
    var hero = this._hero;
    var initialHeroPosition = this._initialHeroPosition;
    this._evils.forEach(function(evil) {
        if (hero.collides(evil)) {
            hero.setPosition(initialHeroPosition);
            HIT_SOUND[(lives % 3)].play();
            lives--;
        }
    });
};


World.prototype.isPlayerOnGoal = function() {
    if (this._hero.collides(this._goal)) {
        return true;
    }
    return false;
};


World.prototype.getEvils = function() {
    return this._evils;
};


World.prototype.getHero = function() {
    return this._hero;
};

World.prototype.getGoal = function() {
    return this._goal;
};

World.prototype.getAllBoxes = function() {
    var boxes = [];
    return boxes.concat(this._decor).concat(this._obstacles).concat(this._goal).concat(this._evils).concat(this._hero);
};


World.prototype.isGameOn = function() {
    return lives > 0 && !this.isPlayerOnGoal();
};


/*
 * MANAGE PLAYER LEFT ACTION
 * */
var _obstacleHeightOverlapsPlayer = function(obstacle, player) {
    return obstacle.getPosition().y + obstacle.size.height < player.getPosition().y || obstacle.getPosition().y > player.getPosition().y + player.size.height;
};

World.prototype._getObstaclesOnTheLeft = function() {
    var obstaclesXs = [];
    var obstaclesOnTheLeft = [];
    var player = this._hero;
    this._obstacles.forEach(function(obst) {
        var obstacleIsOnTheWay = (obst.getPosition().x + obst.size.width < player.getPosition().x) &&
            !_obstacleHeightOverlapsPlayer(obst, player);

        if (obstacleIsOnTheWay) {
            obstaclesXs.push(obst.getPosition().x + obst.size.width);
            obstaclesOnTheLeft.push(obst);
        }
    });
    return obstaclesXs;
};


World.prototype._getMovingSpeedLeft = function() {
    var closestObstacleX = Math.max.apply(null, this._getObstaclesOnTheLeft());
    var moveSpeed = 20;

    while (this._hero.getPosition().x - moveSpeed <= closestObstacleX) {
        moveSpeed--;
    }
    return moveSpeed;
};


World.prototype.leftAction = function() {
    var moveSpeed = this._getMovingSpeedLeft();
    this._hero.move({
        vx: -moveSpeed,
        vy: 0
    });
};


/*
 * MANAGE PLAYER RIGHT ACTION
 * */

World.prototype._getRightObstaclesXs = function() {
    var obstaclesXs = [];
    //var obstaclesOnTheRight = [];
    var player = this._hero;

    this._obstacles.forEach(function(obst) {
        var obstacleIsOnTheWay = (obst.getPosition().x > player.size.width + player.getPosition().x) &&
            !(_obstacleHeightOverlapsPlayer(obst, player));

        if (obstacleIsOnTheWay) {
            obstaclesXs.push(obst.getPosition().x);
            //obstaclesOnTheRight.push(obst);
        }
    });
    return obstaclesXs;
};

World.prototype._getMovingSpeedRight = function() {
    var closestObstacleX = Math.min.apply(null, this._getRightObstaclesXs());
    var moveSpeed = 20;

    while (this._hero.getPosition().x + this._hero.size.width + moveSpeed >= closestObstacleX) {
        moveSpeed--;
    }
    return moveSpeed;
};


World.prototype.rightAction = function() {
    var moveSpeed = this._getMovingSpeedRight();
    this._hero.move({
        vx: moveSpeed,
        vy: 0
    });
};


/*
 * MANAGE PLAYER DOWN ACTION
 * */


var _obstacleWidthOverlapsPlayer = function(obstacle, player) {
    return obstacle.getPosition().x + obstacle.size.width < player.getPosition().x || obstacle.getPosition().x > player.getPosition().x + player.size.width;
};


World.prototype._getObstaclesBelowYs = function() {
    var obstaclesYs = [];
    var obstOnTheWay = [];
    var player = this._hero;

    this._obstacles.forEach(function(obst) {
        var overlap = 0; // <|
        var obstacleIsOnTheWay = (obst.getPosition().y + obst.size.height - overlap > player.getPosition().y) &&
            !_obstacleWidthOverlapsPlayer(obst, player);
        if (obstacleIsOnTheWay) {
            obstaclesYs.push(obst.getPosition().y);
            obstOnTheWay.push(obst);
        }
    });
    return obstaclesYs;
};


World.prototype._getMovingSpeedDown = function() {
    var closestObstacleY = Math.min.apply(null, this._getObstaclesBelowYs());
    var moveSpeed = 20;
    var overlap = 0; // <<|
    while (this._hero.getPosition().y + this._hero.size.height - overlap + moveSpeed >= closestObstacleY) {
        moveSpeed--;
    }
    return moveSpeed;
};


World.prototype.downAction = function() {
    var moveSpeed = this._getMovingSpeedDown();
    this._hero.move({
        vx: 0,
        vy: moveSpeed
    });
};

/*
 * PLAYER UP ACTION
 * */
World.prototype._getObstaclesAboveYs = function() {
    var obstaclesYs = [];
    var player = this._hero;

    this._obstacles.forEach(function(obst) {
        var obstacleIsOnTheWay = (obst.getPosition().y < player.getPosition().y + player.size.height) &&
            !(_obstacleWidthOverlapsPlayer(obst, player));

        if (obstacleIsOnTheWay) {
            obstaclesYs.push(obst.getPosition().y + obst.size.height);
        }
    });

    return obstaclesYs;
};

World.prototype._getMovingSpeedUp = function() {
    var closestObstacleY = Math.max.apply(null, this._getObstaclesAboveYs());
    var moveSpeed = 20;
    while (this._hero.getPosition().y - moveSpeed <= closestObstacleY) {
        moveSpeed--;
    }
    return moveSpeed;
};

World.prototype.upAction = function() {
    var moveSpeed = this._getMovingSpeedUp();
    this._hero.move({
        vx: 0,
        vy: -moveSpeed
    });
};