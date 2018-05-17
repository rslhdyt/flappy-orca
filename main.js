// var widthBoundary = window.innerWidth * window.devicePixelRatio;
// var heightBoundary = window.innerHeight * window.devicePixelRatio;
var widthBoundary = 650;
var totalObstacle = 8;
var heightBoundary = totalObstacle * 59 + 20;

var game = new Phaser.Game(widthBoundary, heightBoundary, Phaser.AUTO, 'container');

// Create our 'main' state that will contain the game
var mainState = {
  preload: function () {
    // This function will be executed at the beginning     
    // That's where we load the images and sounds 
    
    // set orca image
    game.load.image('orca', 'assets/orca.png');

    // set obstacle
    game.load.image('obstacle', 'assets/obstacle.png');

    // set sound
    game.load.audio('jump', 'assets/jump.wav');
  },

  create: function () {
    // This function is called after the preload function     
    // Here we set up the game, display sprites, etc.  
    // Change the background color of the game to blue
    game.stage.backgroundColor = '#71c5cf';

    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the orca at the position x and y
    this.orca = game.add.sprite((widthBoundary + 20) - widthBoundary, (heightBoundary / 2 - 40), 'orca');

    this.obstacles = game.add.group();

    // Add physics to the orca
    // Needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.orca);

    // Add gravity to the orca to make it fall
    this.orca.body.gravity.y = 1000;

    this.jumpSound = game.add.audio('jump');

    // Call the 'jump' function when the spacekey is hit
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this); 

    game.input.onTap.add(this.jump, this);

    this.timer = game.time.events.loop(1500, this.addRowOfObstacles, this);
  },

  update: function () {
    // This function is called 60 times per second    
    // It contains the game's logic
    if (this.orca.y < 0 || this.orca.y > heightBoundary)
      this.restartGame();  

    game.physics.arcade.overlap(this.orca, this.obstacles, this.restartGame, null, this); 
  },

  // Make the orca jump 
  jump: function () {
    // Add a vertical velocity to the orca
    this.orca.body.velocity.y = -350;

    this.jumpSound.play();
  },

  addOneObstacle: function (x, y) {
    // Create a pipe at the position x and y
    var obstacle = game.add.sprite(x, y, 'obstacle');

    // Add the obstacle to our previously created group
    this.obstacles.add(obstacle);

    // Enable physics on the obstacle 
    game.physics.arcade.enable(obstacle);

    // Add velocity to the obstacle to make it move left
    obstacle.body.velocity.x = -300;

    // Automatically kill the obstacle when it's no longer visible 
    obstacle.checkWorldBounds = true;
    obstacle.outOfBoundsKill = true;
  },

  addRowOfObstacles: function () {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * (totalObstacle - 3)) + 1;

    // Add the 6 pipes 
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < totalObstacle; i++)
      if (i != hole && i != hole + 1 && i != hole + 2)
        this.addOneObstacle(widthBoundary, i * 60 + 10);
  },

  // Restart the game
  restartGame: function () {
    // Start the 'main' state, which restarts the game
    game.state.start('main');
  },
};

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');