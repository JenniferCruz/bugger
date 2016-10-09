/**
 As player
 I want to go back to the initial position when I'm in contact with the evil character
 **/
QUnit.test("Go back to initial position when collision", function(assert) {
    var hero = Box({
        x: 20,
        y: 25
    });

    var world = new World({
        initialHeroPosition: {
            x: 20,
            y: 25
        },
        hero: hero,
        evils: [Box({
            x: 0,
            y: 150
        })],
        staticObjects: [],
        decor: []
    });

    //Stubbing collide
    hero.collides = function() {
        return false;
    };
    world.tick();

    assert.deepEqual(hero.getPosition(), {
        x: 20,
        y: 25
    });

    //Stubbing a collision
    hero.collides = function() {
        return true;
    };

    world.tick();
    assert.deepEqual(hero.getPosition(), {
        x: 20,
        y: 25
    });
});

/**
 As player
 I want to know when I reach the goal
 **/

QUnit.test("Box reaches goal", function(assert) {
    var character = Box({
        x: 20,
        y: 10
    }, {
        width: 50,
        height: 50
    });
    var world = new World({
        hero: character,
        evils: [Box({
            x: 0,
            y: 150
        })],
        goal: Box({
            x: 20,
            y: 80
        }, {
            width: 50,
            height: 50
        }),
        staticObjects: [Box({
            x: 450,
            y: 0
        }, {
            width: 1,
            height: 600
        })],
        decor: []
    });
    assert.notOk(world.isPlayerOnGoal());
    world.downAction();
    assert.ok(world.isPlayerOnGoal());
});


/**
 * As a player
 * I want to see enemies bouncing off boundaries and obstacles
 */

// in canvas going up == decrease in y axis. Going down == increase in y axis.
QUnit.test("Enemies bounce off obstacles", function(assert) {
    var enemy = Box({
        x: 301,
        y: 200
    }, {
        width: 50,
        height: 50
    });
    enemy.setVelocity({
        vx: 100,
        vy: 0
    });

    var world = new World({
        hero: Box({
            x: 350,
            y: 0
        }, {
            width: 50,
            height: 50
        }),
        evils: [enemy],
        goal: Box({
            x: 350,
            y: 500
        }, {
            width: 50,
            height: 50
        }),
        staticObjects: [Box({
            x: 450,
            y: 0
        }, {
            width: 1,
            height: 600
        })],
        decor: []
    });

    world.tick();
    assert.deepEqual(world.getEvils()[0].getPosition(), {
        x: 401,
        y: 200
    });

    world.tick();
    assert.deepEqual(world.getEvils()[0].getPosition(), {
        x: 301,
        y: 200
    });
});


/**
 * As player
 * I want to stop when I try to walk passed an obstacle
 * */
QUnit.module('Player cannot pass through obstacles', function(assert) {
    QUnit.test('1 obstacle in the left', function(assert) {
        var world = new World({
            hero: Box({
                x: 60,
                y: 60
            }),
            evils: [Box({
                x: 0,
                y: 500
            })],
            goal: Box({
                x: 0,
                y: 400
            }),
            staticObjects: [Box({
                x: 0,
                y: 0
            }, {
                width: 1,
                height: 606
            })],
            decor: []
        });
        world.leftAction();
        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 20,
            y: 60
        });

        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 2,
            y: 60
        });
    });

    QUnit.test('multiple obstacles in the left', function(assert) {
        var world = new World({
            hero: Box({
                x: 80,
                y: 60
            }, {
                width: 50,
                height: 50
            }),
            evils: [Box({
                x: 0,
                y: 500
            }, {
                width: 50,
                height: 50
            })],
            goal: Box({
                x: 0,
                y: 400
            }, {
                width: 50,
                height: 50
            }),
            staticObjects: [Box({
                x: 0,
                y: 0
            }, {
                width: 1,
                height: 606
            }),
                Box({
                    x: 500,
                    y: 0
                }, {
                    width: 1,
                    height: 606
                }),
                Box({
                    x: 50,
                    y: 60
                }, {
                    width: 5,
                    height: 5
                }),
                Box({
                    x: 50,
                    y: 120
                }, {
                    width: 10,
                    height: 100
                }),
                Box({
                    x: 50,
                    y: 0
                }, {
                    width: 20,
                    height: 20
                })
            ],
            decor: []
        });
        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 60,
            y: 60
        });
        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 56,
            y: 60
        });

        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 56,
            y: 60
        });
    });

    QUnit.test('1 obstacle in the right', function(assert) {
        var world = new World({
            hero: Box({
                x: 60,
                y: 60
            }),
            evils: [Box({
                x: 0,
                y: 0
            })],
            goal: Box({
                x: 0,
                y: 0
            }),
            staticObjects: [Box({
                x: 170,
                y: 0
            }, {
                width: 1,
                height: 606
            })],
            decor: []
        });
        world.rightAction();
        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 100,
            y: 60
        });

        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 119,
            y: 60
        });
    });

    QUnit.test('multiple obstacles in the right', function(assert) {
        var world = new World({
            hero: Box({
                x: 80,
                y: 60
            }),
            evils: [Box({
                x: 0,
                y: 500
            })],
            goal: Box({
                x: 0,
                y: 400
            }),
            staticObjects: [Box({
                x: 0,
                y: 0
            }, {
                width: 1,
                height: 606
            }),
                Box({
                    x: 500,
                    y: 0
                }, {
                    width: 1,
                    height: 606
                }),
                Box({
                    x: 50,
                    y: 60
                }, {
                    width: 5,
                    height: 5
                }),
                Box({
                    x: 80,
                    y: 120
                }, {
                    width: 100,
                    height: 50
                }),
                Box({
                    x: 160,
                    y: 30
                }, {
                    width: 20,
                    height: 50
                })
            ],
            decor: []
        });
        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 100,
            y: 60
        });
        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 109,
            y: 60
        });
    });

    QUnit.test('1 obstacle above', function(assert) {
        var world = new World({
            hero: Box({
                x: 60,
                y: 515
            }),
            evils: [Box({
                x: 0,
                y: 0
            })],
            goal: Box({
                x: 0,
                y: 0
            }),
            staticObjects: [Box({
                x: 0,
                y: 600
            }, {
                width: 500,
                height: 1
            })],
            decor: []
        });
        world.downAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 60,
            y: 535
        });

        world.downAction();
        world.downAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 60,
            y: 549
        });
    });

    QUnit.test('multiple obstacles above', function(assert) {
        var world = new World({
            hero: Box({
                x: 250,
                y: 470
            }),
            evils: [Box({
                x: 0,
                y: 500
            })],
            goal: Box({
                x: 0,
                y: 400
            }),
            staticObjects: [Box({
                x: 0,
                y: 606
            }, {
                width: 500,
                height: 6
            }),
                Box({
                    x: 300,
                    y: 550
                }, {
                    width: 150,
                    height: 50
                }),
                Box({
                    x: 100,
                    y: 450
                }, {
                    width: 100,
                    height: 50
                }),
                Box({
                    x: 450,
                    y: 400
                }, {
                    width: 50,
                    height: 50
                }),
                Box({
                    x: 250,
                    y: 200
                }, {
                    width: 100,
                    height: 50
                })
            ],
            decor: []
        });
        world.downAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 250,
            y: 490
        });
        world.downAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 250,
            y: 499
        });
    });

    QUnit.test('1 obstacle below', function(assert) {
        var world = new World({
            hero: Box({
                x: 60,
                y: 95
            }),
            evils: [Box({
                x: 0,
                y: 600
            })],
            goal: Box({
                x: 0,
                y: 400
            }),
            staticObjects: [Box({
                x: 0,
                y: 0
            }, {
                width: 500,
                height: 1
            })],
            decor: []
        });
        world.upAction();
        world.upAction();

        assert.deepEqual(world.getHero().getPosition(), {
            x: 60,
            y: 55
        });

        world.upAction();
        world.upAction();
        world.upAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 60,
            y: 2
        });
    });

    QUnit.test('multiple obstacles below', function(assert) {
        var world = new World({
            hero: Box({
                x: 250,
                y: 310
            }),
            evils: [Box({
                x: 0,
                y: 600
            })],
            goal: Box({
                x: 0,
                y: 400
            }),
            staticObjects: [Box({
                x: 0,
                y: 0
            }, {
                width: 500,
                height: 6
            }),
                Box({
                    x: 300,
                    y: 550
                }, {
                    width: 150,
                    height: 50
                }),
                Box({
                    x: 100,
                    y: 450
                }, {
                    width: 100,
                    height: 50
                }),
                Box({
                    x: 450,
                    y: 400
                }, {
                    width: 50,
                    height: 50
                }),
                Box({
                    x: 250,
                    y: 200
                }, {
                    width: 100,
                    height: 50
                })
            ],
            decor: []
        });
        world.upAction();
        world.upAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 250,
            y: 270
        });
        world.upAction();
        world.upAction(); // additional / no effect
        assert.deepEqual(world.getHero().getPosition(), {
            x: 250,
            y: 251
        });
    });

    QUnit.test('multiple obstacles lining borders', function(assert) {
        var world = new World({
            hero: Box({
                x: 20,
                y: 50
            }),
            evils: [Box({
                x: 1,
                y: 300
            })],
            goal: Box({
                x: 200,
                y: 200
            }),
            staticObjects: [Box({
                x: 0,
                y: 0
            }, {
                width: 505,
                height: 1
            }),
                Box({
                    x: 0,
                    y: 606
                }, {
                    width: 505,
                    height: 1
                }),
                Box({
                    x: 0,
                    y: 606
                }, {
                    width: 1,
                    height: 606
                }),
                Box({
                    x: 505,
                    y: 606
                }, {
                    width: 1,
                    height: 606
                })
            ],
            decor: []
        });
        // 20 steps down
        for(var i = 0; i < 20; i++){
            world.downAction();
        }
        assert.deepEqual(world.getHero().getPosition(), {
            x: 20,
            y: 450
        });
        // 3 steps right
        world.rightAction();
        world.rightAction();
        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 80,
            y: 450
        });
        // 6 steps down
        for(var i = 0; i < 6; i++){
            world.downAction();
        }

        assert.deepEqual(world.getHero().getPosition(), {
            x: 80,
            y: 555
        });
        world.rightAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 100,
            y: 555
        });
        // 4 steps down - last ones should have no effect
        for(var i = 0; i < 4; i++){
            world.downAction();
        }

        assert.deepEqual(world.getHero().getPosition(), {
            x: 100,
            y: 555
        });
        // a few steps up just to check
        world.upAction();
        world.upAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 100,
            y: 515
        });
    });

    QUnit.test('Scenery surrounded by obstacles', function(assert) {
        var horizontalTop = Box({
            x: 2,
            y: -4
        }, {
            width: 505,
            height: 1
        }, '#FFBF00'); // amarillo
        var verticalLeft = Box({
            x: 0,
            y: 0
        }, {
            width: 1,
            height: 606
        }, '#FF4C05'); // rojo
        var horizontalBottom = Box({
            x: 2,
            y: 600
        }, {
            width: 505,
            height: 1
        }, '#B3C700'); // verde
        var verticalRight = Box({
            x: 505,
            y: 0
        }, {
            width: 1,
            height: 606
        }, '#30ADF0'); // azul

        var world = new World({
            hero: Box({
                x: 20,
                y: 50
            }, {
                width: 50,
                height: 50
            }, '#FF0000'),
            evils: [Box({
                x: 1,
                y: 300
            }, {
                width: 50,
                height: 50
            }, '#000'),
                Box({
                    x: 1,
                    y: 120
                }, {
                    width: 50,
                    height: 50
                }, '#000')
            ],
            goal: Box({
                x: 200,
                y: 200
            }, {
                width: 50,
                height: 50
            }, '#AABB11'),
            staticObjects: [horizontalTop, verticalLeft, horizontalBottom, verticalRight],
            decor: []
        });

        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 2,
            y: 50
        });
        world.leftAction();
        assert.deepEqual(world.getHero().getPosition(), {
            x: 2,
            y: 50
        });
    });

});