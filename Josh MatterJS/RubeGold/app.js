var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 900,
    parent: 'game',
    backgroundColor:'#2143ff',
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
            // debug: true
        }
    }
};

var game = new Phaser.Game(config);
let scaleU = 1;
var inpsK, inpsM;
var ball;
var zoomInTimer, zoomOutTimer;
let xShift = 300*scaleU;
let yShift = 0*scaleU;

function preload() {
    this.load.image('ball','resources/sprites/ball.png');
    this.load.image('dirt','resources/sprites/dirtTop.png');
    this.load.image('dirtLong','resources/sprites/dirtTopLong.png');
    this.load.image('dirtV','resources/sprites/dirtV.png');
    this.load.image('stone','resources/sprites/stone.png');
    this.load.image('stoneLong','resources/sprites/stoneLong.png');
    this.load.image('stoneV','resources/sprites/stoneV.png');
    this.load.image('domino','resources/sprites/domino.png');
    this.load.image('blueP','resources/portalSprites/Blue.png');
    // this.load.json('ballS','resources/sprite_data/ball.json');
}

var zoomN = .5;
var cCap =999;

function create() {


    zoomInTimer = this.time.addEvent({
        delay: 10,
        callback: zoom,
        args: [true, true, cCap],
        loop: true
    });
    zoomOutTimer = this.time.addEvent({
        delay: 10,
        callback: zoom,
        args: [false, true, cCap],
        loop: true
    });
    zoomOutTimer.paused=true;

    this.matter.world.setBounds(0, 0, 1200, 1500, 32, true, true, false, true);

    // this.matter.world.setGravity(0,9.8);
    // this.matter.world.getGravityY();
    // console.log("grav " + this.matter.setGravityY());

    this.cameras.main.setBounds(0, -100);

    inpsK = this.input.keyboard.createCursorKeys();
    inpsM = this.input.activePointer;

    ball = this.matter.add.image(scaleU*1+xShift, scaleU*0+yShift, 'ball');
    ball.setCircle();
    ball.setFrictionAir(0.05)
    // ball.setFriction(0.05);
    ball.setBounce(0.2);
    ball.setScale(.125);
    // ball.setGravityY(-10);

    this.cameras.main.startFollow(ball, true);

    //triggers
    this.matter.add.rectangle(scaleU*150+xShift,scaleU*450+yShift,10,50,{isStatic:true, isSensor:true, label:"detectionOne"});
    this.matter.add.rectangle(scaleU*200+xShift,scaleU*760+yShift,80,10,{isStatic:true, isSensor:true, label:"gravUp"});
    this.matter.add.rectangle(scaleU*380+xShift,scaleU*280+yShift,10,50,{isStatic:true, isSensor:true, label:"gravDown"});
    this.matter.add.rectangle(scaleU*200+xShift,scaleU*900+yShift,10,50,{isStatic:true, isSensor:true, label:"ballVL"});
    this.matter.add.rectangle(scaleU*-170+xShift,scaleU*930+yShift,10,50,{isStatic:true, isSensor:true, label:"dominoDirt"});
    //plats

    //starting ramps
    this.matter.add.image(scaleU*250+xShift,scaleU*300+yShift, 'dirtLong', null, {angle:'-.3', isStatic:true,});
    this.matter.add.image(scaleU*0+xShift,scaleU*100+yShift, 'dirtLong', null, {angle:'.349', isStatic:true,});
    this.matter.add.image(scaleU*10+xShift,scaleU*450+yShift, 'dirtLong', null, {angle:'.3', isStatic:true,});

    //drop to spring||grav
    var yPos = 550
    for(i=0;i<3;i++){
        this.matter.add.image(scaleU*160+xShift,scaleU*yPos+yShift, 'dirtV',null, {angle:'0', isStatic:true,});
        this.matter.add.image(scaleU*250+xShift,scaleU*yPos+yShift, 'dirtV',null, {angle:'0', isStatic:true,});
        yPos+=44;
    }
    for(i=0;i<3;i++){
        this.matter.add.image(scaleU*160+xShift,scaleU*yPos+yShift, 'stoneV',null, {angle:'0', isStatic:true,});
        this.matter.add.image(scaleU*250+xShift,scaleU*yPos+yShift, 'stoneV',null, {angle:'0', isStatic:true,});
        yPos+=44;
    }
    var xPos = 180;
    for(i=0;i<2;i++) {
        this.matter.add.image(scaleU * xPos + xShift, scaleU * 788 + yShift, 'stone', null, {isStatic: true});
        xPos+=42;
    }



    //drop to dominoes
    this.matter.add.image(scaleU*325+xShift,scaleU*860+yShift, 'dirtLong', null, {angle:'-.349', isStatic:true,});
    var killMe = this.matter.add.image(scaleU*100+xShift,scaleU*1000+yShift, 'dirt',null, {angle:'0', isStatic:true, label:"killMe"});
    this.matter.add.image(scaleU*160+xShift,scaleU*1000+yShift, 'stone',null, {angle:'0', isStatic:true});

    //dominoes and their plats
    var dominoes =[];
    dominoes.push(this.matter.add.image(scaleU*158+xShift,scaleU*955+yShift, 'domino',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(scaleU*55+xShift,scaleU*945+yShift, 'domino',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(scaleU*0+xShift,scaleU*945+yShift, 'domino',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(scaleU*-45+xShift,scaleU*945+yShift, 'domino',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(scaleU*-90+xShift,scaleU*945+yShift, 'domino',null, {label:"domino"}).setMass(3));

    this.matter.add.image(scaleU*-80+xShift,scaleU*990+yShift, 'stoneLong', null, {angle:'0', isStatic:true,});

    //TODO catapult/launch
    //https://github.com/liabru/matter-js/blob/master/examples/catapult.js


    var cataplult = this.matter.add.image(scaleU*165+xShift, scaleU*1100+yShift, 'stoneLong', null, { isStatic: true,  label:"cata" });
    var anch = this.matter.add.image(scaleU*165+xShift, scaleU*1200+yShift, 'stoneV', null, {angle: '1.5708', isStatic: true,});

    //TODO drop to gear? //TODO gear?
    //spinning circle with rectangles attached???


    //TODO ramp to pulley//TODO pulley
    //chain with plat attached, weight pulls down won sensor activation
    //https://github.com/liabru/matter-js/blob/master/examples/chains.js


    //TODO end
    //ONLY TEMP
  this.matter.add.image(scaleU*100+xShift,scaleU*1400+yShift, 'blueP', null, {isStatic:true, isSensor:true, label:"portal"}).setScale(.25);



    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
        console.log(bodyA.label + ", " + bodyB.label);
        if((bodyA.label == "Circle Body" && bodyB.label == "detectionOne") || (bodyB.label == "detectionOne" && bodyA.label == "Circle Body")) {

            zoom(false,true);
        }
        if((bodyA.label == "Circle Body" && bodyB.label == "gravUp") || (bodyB.label == "gravUp" && bodyA.label == "Circle Body")) {
            for (i = 0; i<dominoes.length; i++){
                dominoes[i].setIgnoreGravity(true);
            }

            this.matter.world.setGravity(0,-6);
        }
        if((bodyA.label == "Circle Body" && bodyB.label == "gravDown") || (bodyB.label == "gravDown" && bodyA.label == "Circle Body")) {
            // console.log("jeet");

            this.matter.world.setGravity(0,7);
            for (i = 0; i<dominoes.length; i++){
                dominoes[i].setIgnoreGravity(false);
            }
            zoom(true,true);
        }
        if((bodyA.label == "Circle Body" && bodyB.label == "ballVL") || (bodyB.label == "ballVL" && bodyA.label == "Circle Body")) {
            // ball.setVelocityX(-11.5);
            // ball.y = 2314;
            zoom(false,true);
            console.log("trigger");
        }
        if((bodyA.label == "dominoDirt" && bodyB.label == "domino") || (bodyB.label == "domino" && bodyA.label == "dominoDirt")) {
            console.log("kill");
            killMe.destroy();
            dominoes[0].setVelocityX(-10);
            ball.setAngularVelocity(-1);
        }
        if((bodyA.label == "Circle Body" && bodyB.label == "portal") || (bodyB.label == "portal" && bodyA.label == "Circle Body")) {
            //TODO portal tp to next point/map
            // ball.setPosition(12,43);
            //@deprecated
            // this.cameras.main.stopFollow();
            // ball.destroy();
            // ball = this.matter.add.image(scaleU*100+xShift, scaleU*100+yShift, 'ball');

        }
    });

}

//zoomIn/out
//boolean in/out
function zoom(zoomIn, startTime, cap=999) {
    // cCap=cap;
    // console.log("ccap:" +cCap+", cap:" +cap);
    // console.log(zoomIn);
    if(startTime && zoomIn){
        zoomInTimer.paused = false;
    }else if (startTime && !zoomIn) {
        zoomOutTimer.paused = false;
    }

    if(cap!=999) {
        if (zoomIn) {
            console.log("zoom, incap");
            if (zoomN <= cap) {
                zoomN += .01;
            } else {
                console.log("zoom, end incap");
                cCap =999;
                zoomInTimer.paused = true;
            }
        } else if (!zoomIn) {
            console.log("ccap:" +cCap+", cap:" +cap);
            console.log("zoom, outcap");
            if (zoomN >= cap) {
                zoomN -= .01;
            } else {
                console.log("zoom, end outcap");
                cCap = 999;
                zoomOutTimer.paused = true;
            }
        }
    }else{
        if (zoomIn) {
            if (zoomN <= 1.5) {
                zoomN += .01;
            } else {
                zoomInTimer.paused = true;
            }
        } else if (!zoomIn) {
            if (zoomN >= .9) {
                zoomN -= .01;
            } else {
                zoomOutTimer.paused = true;
            }
        }
    }
}

function update() {
    this.cameras.main.setZoom(zoomN);
    if (inpsK.up.isDown){
        this.cameras.main.startFollow(ball, true);
        if(zoomN<1.5){
            zoomN+=.05;
        }
    }
    if (inpsK.down.isDown){
        this.cameras.main.startFollow(ball, false);
        if(zoomN>.25){
            zoomN-=.05;
        }
    }
    if(inpsM.isDown) {
        console.log(ball.x);
        // console.log('X:' + inpsM.x);

        // console.log('Y:' + inpsM.y);
    }
}




