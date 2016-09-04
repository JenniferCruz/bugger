/**
As player
I want to go back to the initial position when I'm in contact with the evil character
**/
QUnit.test("Go back to initial position when collition", function(assert){
  var hero = Box.createHero({x:20, y:25});
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
  var character = Box.createHero({x: 20, y: 10});
  var world = new World({
    initialHeroPosition: {x:20, y:10},
    hero: character,
    evils: [Box.createBox({x:0, y:150})],
    goal: Box.createBox({x: 20, y: 80})
  });
  assert.notOk(world.isGoalReached());
  character.moveUp();
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
    hero: Box.createHero({x: 350, y: 0}),
    evils: [enemy],
    goal: Box.createBox({x: 350, y: 500}),
    staticObjects: [Box.createBox({x: 450, y: 0}, {width:1, height:600})],
  });

  world.tick();
  assert.deepEqual(world.getEvils()[0].getPosition(), {x: 401, y: 200});

  world.tick();
  assert.deepEqual(world.getEvils()[0].getPosition(), {x: 301, y: 200});
});




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
