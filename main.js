var game = new Phaser.Game(600, 490, Phaser.AUTO, 'container');

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

    // Display the orca at the position x=100 and y=245
    this.orca = game.add.sprite(50, 245, 'orca');

    this.obstacles = game.add.group();

    // Add physics to the orca
    // Needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.orca);

    // Add gravity to the orca to make it fall
    this.orca.body.gravity.y = 250;

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
    if (this.orca.y < 0 || this.orca.y > 490)
      this.restartGame();  

    game.physics.arcade.overlap(this.orca, this.obstacles, this.restartGame, null, this); 
  },

  // Make the orca jump 
  jump: function () {
    // Add a vertical velocity to the orca
    this.orca.body.velocity.y = -170;

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
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes 
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++)
      if (i != hole && i != hole + 1)
        this.addOneObstacle(600, i * 60 + 10);
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