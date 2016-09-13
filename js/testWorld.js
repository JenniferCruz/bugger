/**
As player
I want to go back to the initial position when I'm in contact with the evil character
**/
QUnit.test("Go back to initial position when collition", function(assert){
  var hero = Box.createBox({x:20, y:25});
  var world = new World({
    initialHeroPosition: {x:20, y:25},
    hero: hero,
    evils: [Box.createBox({x:0, y:150})]
  });
    //Stubing collide
    hero.collides = function() { return false; }
    world.tick();

    assert.deepEqual(hero.getPosition(), {x:20, y:25});

    //Stubbing a collition
    hero.collides = function() { return true; }
    world.tick();
    assert.deepEqual(hero.getPosition(), {x:20, y:25});
});

/**
As player
I want to know when I reach the goal
**/

QUnit.test("Box reaches goal", function( assert ){
  var character = Box.createBox({x: 20, y: 10});
  var world = new World({
    //initialHeroPosition: {x:20, y:10},
    hero: character,
    evils: [Box.createBox({x:0, y:150})],
    goal: Box.createBox({x: 20, y: 80})
  });
  assert.notOk(world.isGoalReached());
  world.upAction();
  assert.ok(world.isGoalReached());
});


/**
 * As a player
 * I want to see enemies bouncing off boundaries and obstacles
 */

QUnit.test("Enemies bounce off obstacles", function( assert ){
  var enemy = Box.createBox({x:301, y:200});
  enemy.setVelocity({vx:100, vy: 0});

  var world = new World({
    hero: Box.createBox({x: 350, y: 0}),
    evils: [enemy],
    goal: Box.createBox({x: 350, y: 500}),
    staticObjects: [Box.createBox({x: 450, y: 0}, {width:1, height:600})]
  });

  world.tick();
  assert.deepEqual(world.getEvils()[0].getPosition(), {x: 401, y: 200});

  world.tick();
  assert.deepEqual(world.getEvils()[0].getPosition(), {x: 301, y: 200});
});


/**
 * As player
 * I want to stop when I try to walk passed an obstacle
 * */
QUnit.module('Player cannot pass through obstacles', function( assert ){
    QUnit.test('1 obstacle in the left', function( assert ){
        var world = new World({
            hero: Box.createBox({x: 60, y: 60}),
            evils: [Box.createBox({x:0, y:500})],
            goal: Box.createBox({x: 0, y: 400}),
            staticObjects: [Box.createBox({x: 0, y: 0}, {width:1, height:606})]
        });
        world.leftAction();
        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 20, y: 60});

        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 2, y: 60});
    });

    QUnit.test('multiple obstacles in the left', function( assert ){
        var world = new World({
            hero: Box.createBox({x: 80, y: 60}),
            evils: [Box.createBox({x:0, y:500})],
            goal: Box.createBox({x: 0, y: 400}),
            staticObjects: [Box.createBox({x: 0, y: 0}, {width:1, height:606}),
                Box.createBox({x: 500, y: 0}, {width:1, height:606}),
                Box.createBox({x: 50, y: 60}, {width:5, height:5}),
                Box.createBox({x: 50, y: 120}, {width:10, height:100}),
                Box.createBox({x: 50, y: 0}, {width:20, height:20})]
        });
        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 60, y: 60});
        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 56, y: 60});

        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 56, y: 60});
    });

    QUnit.test('1 obstacle in the right', function( assert ){
        var world = new World({
            hero: Box.createBox({x: 60, y: 60}),
            evils: [Box.createBox({x:0, y:0})],
            goal: Box.createBox({x: 0, y: 0}),
            staticObjects: [Box.createBox({x: 170, y: 0}, {width:1, height:606})]
        });
        world.rightAction();
        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 100, y: 60});

        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 119, y: 60});
    });

    QUnit.test('multiple obstacles in the right', function( assert ){
        var world = new World({
            hero: Box.createBox({x: 80, y: 60}),
            evils: [Box.createBox({x:0, y:500})],
            goal: Box.createBox({x: 0, y: 400}),
            staticObjects: [Box.createBox({x: 0, y: 0}, {width:1, height:606}),
                Box.createBox({x: 500, y: 0}, {width:1, height:606}),
                Box.createBox({x: 50, y: 60}, {width:5, height:5}),
                Box.createBox({x: 80, y: 120}, {width:100, height:50}),
                Box.createBox({x: 160, y: 30}, {width:20, height:50})]
        });
        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 100, y: 60});
        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 109, y: 60});
    });


    QUnit.test('1 obstacle above', function( assert ){
        var world = new World({
            hero: Box.createBox({x: 60, y: 555}),
            evils: [Box.createBox({x:0, y:0})],
            goal: Box.createBox({x: 0, y: 0}),
            staticObjects: [Box.createBox({x: 0, y: 600}, {width:500, height:1})]
        });
        world.upAction();
        world.upAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 60, y: 595});

        world.upAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 60, y: 598});
    });

    QUnit.test('multiple obstacles above', function( assert ){
        var world = new World({
            hero: Box.createBox({x: 250, y: 470}),
            evils: [Box.createBox({x:0, y:500})],
            goal: Box.createBox({x: 0, y: 400}),
            staticObjects: [Box.createBox({x: 0, y: 606}, {width:500, height:6}),
                Box.createBox({x: 300, y: 550}, {width:150, height:50}),
                Box.createBox({x: 100, y: 450}, {width:100, height:50}),
                Box.createBox({x: 450, y: 400}, {width:50, height:50}),
                Box.createBox({x: 250, y: 200}, {width:100, height:50})]
        });
        world.upAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 250, y: 490});
        world.upAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 250, y: 499});
    });


    QUnit.test('1 obstacle below', function( assert ){
        var world = new World({
            hero: Box.createBox({x: 60, y: 95}),
            evils: [Box.createBox({x:0, y:600})],
            goal: Box.createBox({x: 0, y: 400}),
            staticObjects: [Box.createBox({x: 0, y: 0}, {width:500, height:1})]
        });
        world.downAction();
        world.downAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 60, y: 55});

        world.downAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 60, y: 51});
    });

    QUnit.test('multiple obstacles below', function( assert ){
        var world = new World({
            hero: Box.createBox({x: 250, y: 280}),
            evils: [Box.createBox({x:0, y:600})],
            goal: Box.createBox({x: 0, y: 400}),
            staticObjects: [Box.createBox({x: 0, y: 0}, {width:500, height:6}),
                Box.createBox({x: 300, y: 550}, {width:150, height:50}),
                Box.createBox({x: 100, y: 450}, {width:100, height:50}),
                Box.createBox({x: 450, y: 400}, {width:50, height:50}),
                Box.createBox({x: 250, y: 200}, {width:100, height:50})]
        });
        world.downAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 250, y: 260});
        world.downAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 250, y: 251});
    });


    QUnit.test('multiple obstacles lining borders', function( assert ){
        var world = new World({
            hero: Box.createBox({x:20, y: 50}),
            evils: [Box.createBox({x:1, y: 300})],
            goal: Box.createBox({x:200, y: 200}),
            staticObjects: [Box.createBox({x:0, y: 0}, {width:505, height:1}),
                Box.createBox({x:0, y: 606}, {width:505, height:1}),
                Box.createBox({x:0, y: 606}, {width:1, height:606}),
                Box.createBox({x:505, y: 606}, {width:1, height:606})]
        });
        // 20 steps up
        world.upAction();world.upAction();world.upAction();world.upAction();
        world.upAction();world.upAction();world.upAction();world.upAction();
        world.upAction();world.upAction();world.upAction();world.upAction();
        world.upAction();world.upAction();world.upAction();world.upAction();
        world.upAction();world.upAction();world.upAction();world.upAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 20, y: 450});
        // 3 steps right
        world.rightAction();world.rightAction();world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 80, y: 450});
        // 6 steps up
        world.upAction();world.upAction();world.upAction();
        world.upAction();world.upAction();world.upAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 80, y: 570});
        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 100, y: 570});
        // 4 steps up - last ones should have no effect
        //world.upAction();world.upAction();world.upAction();world.upAction();
        world.upAction();world.upAction();world.upAction();world.upAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 100, y: 604});
        // a few steps down just to check
        world.downAction();world.downAction();
        assert.deepEqual(world.getHero().getPosition(), {x: 100, y: 564});
    });

});



//heroCollidesWithObstacles


/**
As the scenery painter
I want to access all properties of World
**//*
QUnit.test("World properties can be accessed", function( assert ){
  var character = Box.createBox({x: 0, y: 0});
  var world = new World({
    initialHeroPosition: character.getPosition(),
    hero: character,
    evils: [Box.createBox({x:0, y:150})],
    goal: Box.createBox({x: 20, y: 70})
  });

  assert.deepEqual(world.getEvils(), [Box.createBox({x:0, y:150})]);
  assert.deepEqual(world.getHero(), Box.createBox({x: 0, y: 0}));
  assert.deepEqual(world.getInitialHeroPosition(), {x:0, y:0});
  assert.deepEqual(world.getGoal(), Box.createBox({x: 20, y: 70}));*/
/*});*/
