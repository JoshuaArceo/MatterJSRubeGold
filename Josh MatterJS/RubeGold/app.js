var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 960,
    parent: 'game',
    backgroundColor:'grey',
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    physics: {
        default: "matter",
        matter: {
            gravity:{
                x: 0,
                y:5
            },
            debug: true
        }
    }
};


var game = new Phaser.Game(config);
var inps;
var ball;
var timer;

function preload() {
    this.load.image('ball','resources/sprites/ball.png');

    // this.load.json('ballS','resources/sprite_data/ball.json');
}

var zoomN = .5;

function zoom() {
    // console.log(zoomN);
    if (zoomN <= 1.5) {
        zoomN += .01;
    } else {
        timer.paused = true;
    }
}

function create() {

    timer = this.time.addEvent({
        delay: 10,
        callback: zoom,
        loop: true
    });

    this.matter.world.setBounds(0, 0, 10000, 10000, 32, true, true, false, true);


    this.cameras.main.setBounds(0, -100);

    inps = this.input.keyboard.createCursorKeys();

    ball = this.matter.add.image(200, 100, 'ball');
    ball.setCircle();
    ball.setScale(.5);
    ball.setFriction(0.005);
    ball.setBounce(0.6);
    ball.setVelocityX(1);
    ball.setAngularVelocity(0.15);

    this.cameras.main.startFollow(ball, true);


    var ramp = this.matter.add.rectangle(0,200,600,10, {angle:'0', isStatic:true,});

}

function update() {
    // console.log("zoomN");
    this.cameras.main.setZoom(zoomN);
    if (inps.up.isDown){
        this.cameras.main.startFollow(ball, true);
        if(zoomN<1.5){
            zoomN+=.01;
        }
    }
    if (inps.down.isDown){
        this.cameras.main.startFollow(ball, false);
        if(zoomN>.25){
            zoomN-=.01;
        }
    }
}


