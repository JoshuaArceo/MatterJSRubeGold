var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                x: 0,
                y: 5
            }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'resources/block.png');
    this.load.image('ball', 'resources/ball.png');
    this.load.image('platform', 'resources/platform.png');
}

function create ()
{
    this.matter.add.image(0, 100, 'platform', null, { isStatic: true, width: 10 }).setScale(2, 0.5).setAngle(10);
    var blockA = this.matter.add.image(0, 50, 'block').setBounce(1).setFriction(0).setMass(1);
    var blockB = this.matter.add.image(200, 100, 'block').setMass(1);
    var platform = this.matter.add.image(590, 300, 'platform', null, { isStatic: true, width: 10 }).setScale(2, 0.5);
    blockA.setVelocityX(5);
    var y = 150;


    this.matter.world.on('collisionstart', function (event, bodyA, bodyB, bodyC) {

        bodyA.gameObject.setTint(0xff0000);
        bodyB.gameObject.setTint(0x00ff00);
    });

}
