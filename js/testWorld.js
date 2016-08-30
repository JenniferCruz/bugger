/**
As player
I want to go back to the initial position when I'm in contact with the evil character
**/
QUnit.test("Go back to initial position when collition", function(assert){
  var hero = new Box({x:20, y:25});
    var world = new World({
      initialHeroPosition: {x:0, y:0},
      hero: hero,
      evils: [new Box({x:0, y:150})]
    });

    //Stubing collide
    hero.collides = function() { return false; }
    world.tick();

    assert.deepEqual(hero.getPosition(), {x:20, y:25});

    //Stubbing a collition
    hero.collides = function() { return true; }
    world.tick();
    assert.deepEqual(hero.getPosition(), {x:0, y:0});
});

/**
As player
I want to know when I reach the goal
**/

QUnit.test("Box reaches goal", function( assert ){
  var character = new Box({x: 20, y: 10});
  var world = new World({
    initialHeroPosition: {x:0, y:0},
    hero: character,
    evils: [new Box({x:0, y:150})],
    goal: new Box({x: 20, y: 80})
  });
  assert.notOk(world.isGoalReached());
  character.moveUp();
  assert.ok(world.isGoalReached());
});


/**
As the scenery painter
I want to access all properties of World
**/
QUnit.test("World properties can be accessed", function( assert ){
  var character = new Box({x: 0, y: 0});
  var world = new World({
    initialHeroPosition: character.getPosition(),
    hero: character,
    evils: [new Box({x:0, y:150})],
    goal: new Box({x: 20, y: 70})
  });

  assert.deepEqual(world.getEvils(), [new Box({x:0, y:150})]);
  assert.deepEqual(world.getHero(), new Box({x: 0, y: 0}));
  assert.deepEqual(world.getInitialHeroPosition(), {x:0, y:0});
  assert.deepEqual(world.getGoal(), new Box({x: 20, y: 70}));
});
