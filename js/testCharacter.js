/**
  As player
  I want to move a chracter horizontally or vertically
**/
QUnit.test( "Moving hero left", function( assert ) {
  var character = Box.createHero({x:20, y:40});
  character.moveLeft();
  assert.ok(character.getPosition().x < 20 );
});

QUnit.test( "Moving hero Right", function( assert ) {
  var character = Box.createHero({x:20, y:40});
  character.moveRight();
  assert.ok(character.getPosition().x > 20 );
});

QUnit.test( "Moving hero Up", function( assert ) {
  var character = Box.createHero({x:20, y:40});
  character.moveUp();
  assert.ok(character.getPosition().y > 40 );
});

QUnit.test( "Moving hero Down", function( assert ) {
  var character = Box.createHero({x:20, y:40});
  character.moveDown();
  assert.ok(character.getPosition().y < 40 );
});

/**
  As player
  I want to see an evil character moving alone horizontally with some velocity
**/
QUnit.test( "Evil character moving horizontally", function( assert ) {
  var evilCharacter = Box.createBox({x:20, y:0});
  evilCharacter.setVelocity({vx:4, vy: 0});
  evilCharacter.tick();
  assert.equal(evilCharacter.getPosition().x, 20 + 4);
  evilCharacter.tick();
  assert.equal(evilCharacter.getPosition().x, 20 + 4 + 4);
  evilCharacter.setVelocity({vx:0, vy: 0});
  evilCharacter.tick();
  assert.equal(evilCharacter.getPosition().x, 20 + 4 + 4);
  assert.equal(evilCharacter.getPosition().y, 0);
});

QUnit.test("Velocity is always defined", function( assert ){
  var character = Box.createBox({x:20, y:0});
  character.tick();
  assert.ok(character.velocity != undefined);
});

QUnit.test("Box position getter is inmutable", function( assert ){
  var character = Box.createBox({x:20, y:0});
  var charPos = character.getPosition();
  charPos.x = 0;
  assert.deepEqual(character.getPosition(), {x:20, y:0});
});

QUnit.test("Box position setter is inmutable", function( assert ){
  var character = Box.createBox({x:20, y:0});
  var point = {x: 3, y: 7};
  character.setPosition(point);
  point.x = 5;
  assert.deepEqual(character.getPosition(), {x: 3, y: 7});
});

QUnit.module("Detect character collitions", function( assert ){

  QUnit.test("Detect evil and player collition", function( assert ){
    var player = Box.createHero({x:0, y:0},{width:21, height:21});
    var evil = Box.createBox({x:20, y: 20});
    assert.ok(player.collides(evil));
  });

  QUnit.test("Detect evil and player not collition", function( assert ){
    var player = Box.createBox({x:0, y:0}, {width:99, height:99});
    var evil = Box.createBox({x:100, y: 100})
    assert.notOk(player.collides(evil));
  });

  QUnit.test("Detect x only collition", function( assert ){
    var player = Box.createBox({x:0, y:0}, {width:21, height:20});
    var evil = Box.createBox({x:20, y: 0})
    assert.ok(player.collides(evil));
  });

  QUnit.test("Detect y only collition", function( assert ){
    var player = Box.createBox({x:0, y:0},{width:1, height:26});
    var evil = Box.createBox({x:0, y: 25})
    assert.ok(player.collides(evil));
  });

  QUnit.test("Detect x only not collition", function( assert ){
    var player = Box.createBox({x:0, y:0}, {width:50, height:1});
    var evil = Box.createBox({x:51, y: 0})
    assert.notOk(player.collides(evil));
  });

  QUnit.test("Detect y only not collition", function( assert ){
    var player = Box.createBox({x:0, y:0}, {width:1, height:50});
    var evil = Box.createBox({x:0, y: 51})
    assert.notOk(player.collides(evil));
  });

  QUnit.test("Detect non collition with non default sizes", function( assert ){
    var player = Box.createBox({x:0, y:0}, {width:20, height:20});
    var evil = Box.createBox({x:0, y: 21}, {width:8, height:8})
    assert.notOk(player.collides(evil));
  });

});
