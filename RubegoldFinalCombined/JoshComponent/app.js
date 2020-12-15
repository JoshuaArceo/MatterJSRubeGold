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
            debug: true
        }
    }
};

var game = new Phaser.Game(config);
var inpsK, inpsM;
var ball;
var zoomInTimer, zoomOutTimer;
let xShift = 300;
let yShift = 0;

function preload() {
    this.load.image('ball','resources/sprites/ball.png');
    this.load.image('dirt','resources/sprites/dirtTop.png');
    this.load.image('dirtLong','resources/sprites/dirtTopLong.png');
    this.load.image('dirtV','resources/sprites/dirtV.png');
    this.load.image('stone','resources/sprites/stone.png');
    this.load.image('stoneLong','resources/sprites/stoneLong.png');
    this.load.image('stoneV','resources/sprites/stoneV.png');
    this.load.image('domino','resources/sprites/domino.png');
    this.load.image('weight','resources/sprites/weight.png');
    this.load.image('blueP','resources/portalSprites/Blue.png');
    // this.load.json('ballS','resources/sprite_data/ball.json');
}

var zoomN = .5;
var cCap =999;

function create() {

    this.matter.world.engine.timing.timeScale = .75;

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

    this.matter.world.setBounds(0, 0, 1200, 1800, 32, true, true, false, true);

    // this.matter.world.setGravity(0,9.8);
    // this.matter.world.getGravityY();
    // console.log("grav " + this.matter.setGravityY());

    this.cameras.main.setBounds(0, -100);

    inpsK = this.input.keyboard.createCursorKeys();
    inpsM = this.input.activePointer;

    ball = this.matter.add.image(1+xShift, yShift, 'ball');
    ball.setCircle();
    ball.setFrictionAir(0.05)
    // ball.setFriction(0.05);
    ball.setBounce(0.2);
    ball.setScale(.125);
    // ball.setGravityY(-10);

    this.cameras.main.startFollow(ball, true);

    //triggers
    this.matter.add.rectangle(150+xShift,450+yShift,10,50,{isStatic:true, isSensor:true, label:"detectionOne"});
    this.matter.add.rectangle(200+xShift,760+yShift,80,10,{isStatic:true, isSensor:true, label:"gravUp"});
    this.matter.add.rectangle(380+xShift,280+yShift,10,50,{isStatic:true, isSensor:true, label:"gravDown"});
    this.matter.add.rectangle(200+xShift,900+yShift,10,50,{isStatic:true, isSensor:true, label:"ballVL"});
    this.matter.add.rectangle(-170+xShift,930+yShift,10,50,{isStatic:true, isSensor:true, label:"dominoDirt"});
    this.matter.add.rectangle(20+xShift,1200+yShift,10,50,{isStatic:true, isSensor:true, label:"weightDrop"});
    //plats

    //starting ramps
    this.matter.add.image(250+xShift,300+yShift, 'dirtLong', null, {angle:'-.3', isStatic:true,});
    this.matter.add.image(xShift,100+yShift, 'dirtLong', null, {angle:'.349', isStatic:true,});
    this.matter.add.image(10+xShift,450+yShift, 'dirtLong', null, {angle:'.3', isStatic:true,});

    //drop to spring||grav
    var yPos = 550
    for(i=0;i<3;i++){
        this.matter.add.image(160+xShift,yPos+yShift, 'dirtV',null, {angle:'0', isStatic:true,});
        this.matter.add.image(250+xShift,yPos+yShift, 'dirtV',null, {angle:'0', isStatic:true,});
        yPos+=44;
    }
    for(i=0;i<3;i++){
        this.matter.add.image(160+xShift,yPos+yShift, 'stoneV',null, {angle:'0', isStatic:true,});
        this.matter.add.image(250+xShift,yPos+yShift, 'stoneV',null, {angle:'0', isStatic:true,});
        yPos+=44;
    }
    var xPos = 180;
    for(i=0;i<2;i++) {
        this.matter.add.image(xPos + xShift, 788 + yShift, 'stone', null, {isStatic: true});
        xPos+=42;
    }



    //drop to dominoes
    this.matter.add.image(325+xShift,860+yShift, 'dirtLong', null, {angle:'-.349', isStatic:true,});
    var killMe = this.matter.add.image(100+xShift,1000+yShift, 'dirt',null, {angle:'0', isStatic:true, label:"killMe"});
    this.matter.add.image(160+xShift,1000+yShift, 'stone',null, {angle:'0', isStatic:true});

    //dominoes and their plats
    var dominoes =[];
    dominoes.push(this.matter.add.image(158+xShift,955+yShift, 'domino',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(55+xShift,945+yShift, 'domino',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(xShift,945+yShift, 'domino',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(-45+xShift,945+yShift, 'domino',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(-90+xShift,945+yShift, 'domino',null, {label:"domino"}).setMass(3));

    this.matter.add.image(-80+xShift,990+yShift, 'stoneLong', null, {angle:'0', isStatic:true,});

    //TODO catapult/launch
    //https://github.com/liabru/matter-js/blob/master/examples/catapult.js


    var cataplult = this.matter.add.image(165+xShift, 1400+yShift, 'stoneLong', null, { isStatic: false,  label:"catapult" });
    this.matter.add.image(80+xShift, 1250+yShift, 'stoneV', null, { isStatic: true,});
    this.matter.add.image(10+xShift, 1190+yShift, 'stoneV', null, { isStatic: true,});
    // var anch = this.matter.add.image(165+xShift, 1200+yShift, 'stoneV', null, { isStatic: true,});
    var anch = this.matter.add.polygon(165+xShift, 1200+yShift, 3, 1, {angle: 1.5708, isStatic: true, render: { fillStyle: '#224242'}});
    this.matter.add.constraint(cataplult, anch,.0,.8);
    var weight = this.matter.add.image(40+xShift, 1300+yShift, 'weight').setStatic(true);

    /*@deprecated
    //TODO drop to gear? //TODO gear?
    //spinning circle with rectangles attached???


    //TODO ramp to pulley//TODO pulley
    //chain with plat attached, weight pulls down won sensor activation
    //https://github.com/liabru/matter-js/blob/master/examples/chains.js
    */

    //TODO end
    this.matter.add.image(500+xShift,1400+yShift, 'blueP', null, {isStatic:true, isSensor:true, label:"portal"}).setScale(.25);



    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
        console.log(bodyA.label + ", " + bodyB.label);
        if((bodyA.label === "Circle Body" && bodyB.label === "detectionOne") || (bodyB.label === "detectionOne" && bodyA.label === "Circle Body")) {

            zoom(false,true);
        }
        if((bodyA.label === "Circle Body" && bodyB.label === "gravUp") || (bodyB.label === "gravUp" && bodyA.label === "Circle Body")) {
            //TODO ignore grav for objects
            cataplult.setIgnoreGravity(true);
            // anch.setIgnoreGravity(true);
            for (i = 0; i<dominoes.length; i++){
                dominoes[i].setIgnoreGravity(true);
            }

            this.matter.world.setGravity(0,-6);
        }
        if((bodyA.label === "Circle Body" && bodyB.label === "gravDown") || (bodyB.label === "gravDown" && bodyA.label === "Circle Body")) {
            // console.log("jeet");
            //TODO unignore grav for objects
            this.matter.world.setGravity(0,7);
            for (i = 0; i<dominoes.length; i++){
                dominoes[i].setIgnoreGravity(false);
                cataplult.setIgnoreGravity(false);
                // anch.setIgnoreGravity(false);
            }
            zoom(true,true);
        }
        if((bodyA.label === "Circle Body" && bodyB.label === "ballVL") || (bodyB.label === "ballVL" && bodyA.label === "Circle Body")) {
            // ball.setVelocityX(-11.5);
            // ball.y = 2314;
            zoom(false,true);
            console.log("trigger");
        }
        if((bodyA.label === "dominoDirt" && bodyB.label === "domino") || (bodyB.label === "domino" && bodyA.label === "dominoDirt")) {
            console.log("kill");
            killMe.destroy();
            dominoes[0].destroy();
            dominoes[1].destroy();
            ball.setAngularVelocity(-1);
        }
        if((bodyA.label === "Circle Body" && bodyB.label === "portal") || (bodyB.label === "portal" && bodyA.label === "Circle Body")) {
            //TODO portal tp to next point/map
            // ball.setPosition(12,43);
            //@deprecated
            // this.cameras.main.stopFollow();
            // ball.destroy();
            // ball = this.matter.add.image(100+xShift, 100+yShift, 'ball');

        }
        if((bodyA.label === "Circle Body" && bodyB.label === "weightDrop") || (bodyB.label === "weightDrop" && bodyA.label === "Circle Body")) {
            weight.setStatic(false);
            weight.setVelocityY(-30);
            //Catapults do not function as they do in native matter; these are added to artificially launch
            cataplult.setAngularVelocity(.15);
            ball.setVelocityX(30);
            ball.setVelocityY(-30);


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

    if(cap!==999) {
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

    //artificial slo mo, lags system, buggy, may break game
    // this.r = 0;
    // this.wasteTime = .25;
    // for(var i = 0; i < this.wasteTime * 500000; i++)
    // {
    //     var a = Math.sqrt(i);
    //     this.r += a * a;
    // }
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
