import Phaser from 'phaser';

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

// var widthBoundary = window.innerWidth * window.devicePixelRatio;
// var heightBoundary = window.innerHeight * window.devicePixelRatio;
// var widthBoundary = 650;
// var totalObstacle = 8;
// var heightBoundary = totalObstacle * 59 + 20;

var game = new Phaser.Game(config);

var pipes;
var orca;
var cursors;
var score = 0;
var scoreText;

function preload ()
{
    this.load.image('sea', './assets/sea.png');
    this.load.image('orca', './assets/orca.png');
    this.load.image('pipe', './assets/obstacle.png');
    this.load.audio('jump', './assets/jump.wav');
}

function create ()
{
    this.add.image(180, 130, 'sea');

    pipes = this.physics.add.group();

    orca = this.physics.add.sprite(300, 300, 'orca');
    orca.setCollideWorldBounds(true);

    // load audio
    this.jumpSound = this.sound.add('jump');

    this.physics.add.overlap(orca, pipes, gameOver, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.time.addEvent({ delay: 2000, callback: createPipes, callbackScope: this, loop: true });
}

function update ()
{
    if (cursors.space.isDown) {
        orca.setVelocityY(-200);
        
        this.jumpSound.play();
    }
}

function createPipes ()
{
    var gap = Phaser.Math.Between(100, 200);
    var pipePosition = Phaser.Math.Between(50, 550 - gap);

    var pipeTop = pipes.create(800, pipePosition, 'pipe').setOrigin(0, 1).setScale(1, -1).refreshBody();
    var pipeBottom = pipes.create(800, pipePosition + gap, 'pipe').setOrigin(0, 0).refreshBody();

    pipeTop.body.setVelocityX(-200);
    pipeBottom.body.setVelocityX(-200);

    pipeTop.checkWorldBounds = true;
    pipeTop.outOfBoundsKill = true;
}

function gameOver ()
{
    this.physics.pause();
    orca.setTint(0xff0000);
}