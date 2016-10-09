# BUGGER | An arcade game

This game was adapted from the [Arcade Game repo](https://github.com/udacity/frontend-nanodegree-arcade-game) of Udacity, as one of the projects in the very cool [Udacity Nanodegree Program in Front End Development](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001?v=fe2).

If you just want to play click [here](#) and start playing right away! Else...  

## Running the game

#### Download it to your computer

1. Clone [this](#) repo

#### Load it into your browser

2. Open the file __*intro.html*__ in Chrome
3. Play!

## Playing the game 

1. In this version of the game, you get to be a bug. **Choose your player bug**
2. Use the **arrows** in your keyboard to move around
3. Try to **reach the goal** and don't let feet and shoes step on you!

## Making changes to the game 
If you want to make any changes to the game design or difficulty (or maybe just add additional levels), here's a brief introduction to the most important javascript classes you'll find:

### The Box class
This class was designed with the intention to keep everything that can be thought of as a point or entity in space in a logical unit (think Cartesian plane). __All entities in a world are represented as boxes__. This includes the hero character, the enemies, obstacles and boundaries. 

Most functions within this class try to reflect how those boxes can interact in a 2D space. 

Boxes have an object __position (x, y)__, an object __size (width, height)__ and an __img url__. 

Boxes mostly __move__ _(change position)_, __stop__ _(set velocity to zero)_ and check whether they __colllided__ with another box. 

As a side note, this class was developed thinking I would need to use 'inheritance'. I ended up not needing it, but it should be easy to extend the Box class with the 'functional inheritance' concept.

### The World class

This class puts together everything that makes up a worl in a game. It keeps track of the __characters__ (good and bad) and information about all __decorative elements, obstacles and goal__. Additionally, implements all functions related to how those elements interact with one another. 

This should be your class if you are trying to adjust things like __collisions__ between elements in the canvas, managing __user input__, __player's lives__ and whether the __goal was reached__ or not.

### The App class
Everything comes together here. This file is the meeting point between the canvas and the game logic. Here, variables are set up: __images are loaded__ and the __layout of the world is created__ (along with the elements that will need to be passed as parameters to create a new world). Here, you'll find 3 important functions:

#### game
__Sets up variables__ for the game (player, enemies, obstacles -borders-, and decorative elements) and defines functions to __read user input__, to __update world__ and to __draw the current state of the game__ (or call the other functions if the game status changes -game over or win-)

#### youWin

__It draws the canvas__ if the player reaches the goal (and thus wins).

#### gameOver

__It draws the canvas__ if the player is dead before reaching the goal. Said in less gentle terms, you lost!


## Version
1.0

### Known bugs

There's a loafer in the game going aroun its own way, disregarding the tile obstacles in the middle!