var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 750,
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
    this.load.image('tube', 'resources/unnamed.png');
    this.load.image('triangle', 'resources/triangle (1).png');
    this.load.image('domino', 'resources/black.png');

}

function create ()
{
    var blockB = this.matter.add.image(200, 80, 'block').setMass(10);
    var still = this.matter.add.image(1200, 200, 'block', null, {isStatic:true}).setMass(13);
    this.matter.add.image(0, 700, 'platform', null, { isStatic: true, width: 1 }).setScale(6, 0.5).setAngle(0);
    this.matter.add.image(0, 60, 'platform', null, { isStatic: true, width: 1 }).setScale(1.2, 0.3).setAngle(10);
    this.matter.add.image(670, 600, 'tube', null, {isStatic:true, width:0.5}).setScale(0.1, 0.5);
    this.matter.add.image(330, 600, 'triangle',null, { isStatic: true, width: 1 }).setScale(1, 1);
    var ss =  this.matter.add.image(340, 600, 'platform', null, { width: 1 }).setScale(1, 0.5).setAngle(10).setMass(0.5);
    var ramp = this.matter.add.image(900, 500, 'platform', null, { isStatic: true, width: 1 }).setScale(1, 0.5).setAngle(13);
    var blockC = this.matter.add.image(709, 395, 'block',null, {isStatic:true}).setMass(2).setAngle(13);
    var blockD = this.matter.add.image(1100, 460, 'block',null, {isStatic:true}).setMass(2).setAngle(13);
    var string =     this.matter.add.image(1100, 300, 'tube', null, {  width:0.5}).setScale(0.1, 0.65).setFixedRotation(true).setAngle(15);
    var x= 1190;
    still.setFixedRotation();
    // string.setFixedRotation();
    this.matter.add.joint(still, string);
    this.matter.add.joint(still, blockD);
    // this.matter.add.joint(string, blockD);

    setInterval(function(){
        if(ss.x>362||ss.x<361 && ss.y<500){
            blockC.setStatic(false);
        }
        if(blockC.x>=939.8){
            blockD.setStatic(false);
        }
    }, 1000);
    for (var i =0; i<3; i++){
        this.matter.add.image(x, 600, 'domino').setScale(0.5, 1.9);
        x=x+10;
    }



}
