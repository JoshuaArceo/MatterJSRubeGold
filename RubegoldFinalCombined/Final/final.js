var config = {
    type: Phaser.AUTO,
    width: 1000,
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
            // enableSleeping: true,
            gravity:{
                x: 0,
                y:5
            },
            debug: true
        }
    }
};




//Josh
var inpsK, inpsM;
var ballJ;
var zoomInTimer, zoomOutTimer;
let xShift = 300;
let yShift = 0;
var zoomN = .5;
var cCap =999;

//Ryan
let rXShift = 2000;
let pYShift = 0;
let units = 1920/2560;


//Kaustubha
let kXShift = 4000;
let kYShift = 500;


var game = new Phaser.Game(config);

function preload() {
    //Josh
    this.load.image('ballJ','Josh/resources/sprites/ball.png');
    this.load.image('dirt','Josh/resources/sprites/dirtTop.png');
    this.load.image('dirtLong','Josh/resources/sprites/dirtTopLong.png');
    this.load.image('dirtV','Josh/resources/sprites/dirtV.png');
    this.load.image('stone','Josh/resources/sprites/stone.png');
    this.load.image('stoneLong','Josh/resources/sprites/stoneLong.png');
    this.load.image('stoneV','Josh/resources/sprites/stoneV.png');
    this.load.image('dominoJ','Josh/resources/sprites/domino.png');
    this.load.image('weight','Josh/resources/sprites/weight.png');
    this.load.image('blueP','Josh/resources/portalSprites/Blue.png');
    this.load.image('orangeP','Josh/resources/portalSprites/Orange.png');

    //Ryan
    this.load.image('blockR','Ryan/resources/marble.png');
    this.load.image('g','Ryan/resources/green.png');
    this.load.image('r','Ryan/resources/red.png');

    //Kaustubha
    this.load.image('blockK', 'Kaustubha/resources/block.png');
    this.load.image('ballK', 'Kaustubha/resources/ball.png');
    this.load.image('platform', 'Kaustubha/resources/platform.png');
    this.load.image('tube', 'Kaustubha/resources/unnamed.png');
    this.load.image('triangle', 'Kaustubha/resources/triangle (1).png');
    this.load.image('dominoK', 'Kaustubha/resources/black.png');
}

var lBall;
var plat3=this.matter;
var stayStill =[];
function create() {
    // kFreeze();
    // this.matter.world.engine.timing.timeScale = .9;
    inpsK = this.input.keyboard.createCursorKeys();
    inpsM = this.input.activePointer;
    //Josh


    zoomInTimer = this.time.addEvent({
        delay: 10,
        callback: zoom,
        args: [true, false, cCap],
        loop: true
    });
    zoomOutTimer = this.time.addEvent({
        delay: 10,
        callback: zoom,
        args: [false, true, cCap],
        loop: true
    });
;
    zoomOutTimer.paused=true;

    this.matter.world.setBounds(0, 0, 6000, 1800, 32, true, true, false, true);

    // this.matter.world.setGravity(0,9.8);
    // this.matter.world.getGravityY();
    // console.log("grav " + this.matter.setGravityY());

    this.cameras.main.setBounds(0, 100);


    ballJ = this.matter.add.image(1+xShift, yShift, 'ballJ');
    ballJ.setCircle();
    ballJ.setFrictionAir(0.05)
    // ball.setFriction(0.05);
    ballJ.setBounce(0.2);
    ballJ.setScale(.125);
    // ball.setGravityY(-10);

    this.cameras.main.startFollow(ballJ, true);

    //triggers
    this.matter.add.rectangle(150+xShift,450+yShift,10,50,{isStatic:true, isSensor:true, label:"detectionOne"});
    this.matter.add.rectangle(200+xShift,760+yShift,80,10,{isStatic:true, isSensor:true, label:"gravUp"});
    this.matter.add.rectangle(380+xShift,280+yShift,10,50,{isStatic:true, isSensor:true, label:"gravDown"});
    this.matter.add.rectangle(200+xShift,900+yShift,10,50,{isStatic:true, isSensor:true, label:"ballVL"});
    this.matter.add.rectangle(-170+xShift,930+yShift,10,50,{isStatic:true, isSensor:true, label:"dominoDirt"});
    this.matter.add.rectangle(30+xShift,1150+yShift,20,50,{isStatic:true, isSensor:true, label:"weightDrop"});
    this.matter.add.rectangle(640+kXShift,380+kYShift,100,200,{isStatic:true, isSensor:true, label:"unlockBlockC"});
    this.matter.add.rectangle(1100+kXShift,460+kYShift,20,50,{isStatic:true, isSensor:true, label:"unlockBlockD"});
    this.matter.add.rectangle(640*units+rXShift,900*units,500, 20,{isStatic:true, isSensor:true, label:"pballCam"});
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
    this.matter.add.image(580+xShift,770+yShift, 'dirtLong', null, {angle:'-.349', isStatic:true,});
    var killMe = this.matter.add.image(100+xShift,1000+yShift, 'dirt',null, {angle:'0', isStatic:true, label:"killMe"});
    this.matter.add.image(160+xShift,1000+yShift, 'stone',null, {angle:'0', isStatic:true});

    //dominoes and their plats
    var dominoes =[];
    dominoes.push(this.matter.add.image(158+xShift,955+yShift, 'dominoJ',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(55+xShift,945+yShift, 'dominoJ',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(xShift,945+yShift, 'dominoJ',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(-45+xShift,945+yShift, 'dominoJ',null, {label:"domino"}).setMass(3));
    dominoes.push(this.matter.add.image(-90+xShift,945+yShift, 'dominoJ',null, {label:"domino"}).setMass(3));

    this.matter.add.image(-80+xShift,990+yShift, 'stoneLong', null, {angle:'0', isStatic:true,});

    // catapult/launch
    //https://github.com/liabru/matter-js/blob/master/examples/catapult.js


    var cataplult = this.matter.add.image(165+xShift, 1400+yShift, 'stoneLong', null, { isStatic: false,  label:"catapult" });
    this.matter.add.image(80+xShift, 1250+yShift, 'stoneV', null, { isStatic: true,});
    this.matter.add.image(10+xShift, 1190+yShift, 'stoneV', null, { isStatic: true,});
    // var anch = this.matter.add.image(165+xShift, 1200+yShift, 'stoneV', null, { isStatic: true,});
    var anch = this.matter.add.polygon(165+xShift, 1200+yShift, 3, 1, {angle: 1.5708, isStatic: true, render: { fillStyle: '#224242'}});
    this.matter.add.constraint(cataplult, anch,.0,.8);
    var weight = this.matter.add.image(40+xShift, 1300+yShift, 'weight').setStatic(true);

    /*@deprecated
    // drop to gear? // gear?
    //spinning circle with rectangles attached???


    // ramp to pulley// pulley
    //chain with plat attached, weight pulls down won sensor activation
    //https://github.com/liabru/matter-js/blob/master/examples/chains.js
    */

    //end
    this.matter.add.image(500+xShift,1400+yShift, 'blueP', null, {isStatic:true, isSensor:true, label:"portal"}).setScale(.25);
    var camC = 0;
    // var porC =0;
    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
        console.log(bodyA.label + ", " + bodyB.label);
        if((bodyA.label === "Circle Body" && bodyB.label === "detectionOne") || (bodyB.label === "detectionOne" && bodyA.label === "Circle Body")) {

            zoom(false,true);
        }
        if((bodyA.label === "Circle Body" && bodyB.label === "gravUp") || (bodyB.label === "gravUp" && bodyA.label === "Circle Body")) {
            //J
            for (i = 0; i<dominoes.length; i++){
                dominoes[i].setIgnoreGravity(true);
            }
            //R


            // console.log(dot);

           makeStatic();


            this.matter.world.setGravity(0,-6);

            //K
            // ignore grav for objects
            // blockB.setIgnoreGravity(true);
            blockC.setIgnoreGravity(true);
            blockD.setIgnoreGravity(true);
            ss.setIgnoreGravity(true);
            ramp.setIgnoreGravity(true);
            dominoesK[0].setIgnoreGravity(true);
            dominoesK[1].setIgnoreGravity(true);
            dominoesK[2].setIgnoreGravity(true);
            cataplult.setIgnoreGravity(true);


            // anch.setIgnoreGravity(true);

        }
        if((bodyA.label === "Circle Body" && bodyB.label === "gravDown") || (bodyB.label === "gravDown" && bodyA.label === "Circle Body")) {
            this.matter.world.setGravity(0,7);
            for (i = 0; i<dominoes.length; i++){
                dominoes[i].setIgnoreGravity(false);
                cataplult.setIgnoreGravity(false);
                console.log(ramp);
                // anch.setIgnoreGravity(false);
            }
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
            ballJ.setAngularVelocity(-1);
        }
        if((bodyA.label === "Circle Body" && bodyB.label === "portal") || (bodyB.label === "portal" && bodyA.label === "Circle Body")) {
            //R
            this.matter.world.setGravity(0,5);
            releaseStatic();
            console.log("woosh");
            this.cameras.main.stopFollow();
            this.cameras.main.pan(2000, -100, 1000);
            zoom(false,true,0.5);
            ballJ.setPosition(orangeOne.x,orangeOne.y);
            ballJ.setMass(10).setBounce(.5).setFriction(3).setScale(.18);
            // zoom(false,true,.5);
            // this.cameras.main.startFollow(blockB, true);
        }
        if((bodyA.label === "Circle Body" && bodyB.label === "weightDrop") || (bodyB.label === "weightDrop" && bodyA.label === "Circle Body")) {
            weight.setStatic(false);
            weight.setVelocityY(-30);
            //Catapults do not function as they do in native matter; these are added to artificially launch
            cataplult.setAngularVelocity(.15);
            ballJ.setVelocityX(30);
            ballJ.setVelocityY(-30);
        }

        if((bodyA.label === "Circle Body" && bodyB.label === "portal1") || (bodyA.label === "portal1" && bodyB.label === "Circle Body")) {
            console.log("ayy");
            stayStill[5].setPosition(lastP.x,lastP.y);
            stayStill[5].setMass(10);
            stayStill[5].setScale(.15);
            //K next portal
            // blockB.setIgnoreGravity(false);
            // blockB.setStatic(false);
            // console.log(blockB);
            blockC.setIgnoreGravity(false);
            blockD.setIgnoreGravity(false);
            ss.setIgnoreGravity(false);
            ramp.setIgnoreGravity(false);
            dominoesK[0].setIgnoreGravity(false);
            dominoesK[1].setIgnoreGravity(false);
            dominoesK[2].setIgnoreGravity(false);
        }

        if((bodyA.label === "blockC" && bodyB.label === "Rectangle Body") || (bodyB.label === "blockC" && bodyA.label === "Rectangle Body")) {
            this.cameras.main.stopFollow();
            this.cameras.main.pan(blockC.x, blockC.y,500);
            setTimeout(() => { this.cameras.main.startFollow(blockC, true); }, 250);
            // console.log("rampblockC");
            blockC.setStatic(false);
            blockD.setStatic(false);
        }
        if((bodyA.label === "pballCam" && bodyB.label === "Circle Body") || (bodyB.label === "pballCam" && bodyA.label === "Circle Body")) {
            console.log(camC);
            console.log(pball);
            if(camC==0) {
                this.cameras.main.stopFollow();
                this.cameras.main.pan(stayStill[6].x, stayStill[6].y,1000);
                setTimeout(() => { this.cameras.main.startFollow(stayStill[6], true); }, 1000);

                camC++;
            }else if(camC==1){
                camC++;
                this.cameras.main.stopFollow();
                this.cameras.main.pan(stayStill[5].x, stayStill[5].y,700);
                setTimeout(() => { this.cameras.main.startFollow(stayStill[5], true); }, 400);
                console.log(stayStill[5]);
            }
        }

    });

    //Ryan
    //essentials
    this.matter.add.mouseSpring();


    //floors
    let ground = this.matter.add.image(1100*units+rXShift,550*units,'r').setScale(420*units,20*units).setStatic(true);
    let rSide = this.matter.add.image(1500*units+rXShift,300*units,'r').setScale(700*units,20*units).setStatic(true);
    let lSide = this.matter.add.image(850*units+rXShift,900*units,'r').setScale(700*units,20*units).setStatic(true);
    let kSide = this.matter.add.image(350*units+rXShift,300*units,'r').setScale(400*units,20*units).setStatic(true);
    let mSide = this.matter.add.image(140*units+rXShift,520*units,'r').setScale(400*units,20*units).setStatic(true);
    let bSide = this.matter.add.image(1200*units+rXShift,675*units,'r').setScale(20*units,500*units).setStatic(true);
    rSide.angle+=100;
    lSide.angle+=100;
    bSide.angle+=80;
    kSide.angle-=42;
    mSide.angle+=42;
    // var Body = this.matter.body;
    // Body.rotate(rSide,-3);
    // Body.rotate(lSide,-3);
    // Body.rotate(bSide,3);
    // Body.rotate(kSide,-5);
    // Body.rotate(mSide,5.5);

    var portal1 = this.matter.add.image(2200*units+rXShift,1100*units, 'blueP', null, {isStatic:true, isSensor:true, label:"portal1",}).setScale(.4);
    var orangeOne = this.matter.add.image(400*units+rXShift,10*units,'orangeP',null,{isSensor:true});
    var ballR = this.matter.add.image(370*units+rXShift,600*units,'blockR').setBounce(.5).setFriction(0);
    ballR.setScale(0.09,0.09)
    ballR.setCircle(26);
    orangeOne.setScale(.25);
    orangeOne.setStatic(true);
    // ball1.setVelocityX(5);
    // this.matter.add.rectangle(100*units,550*units,420*units,20*units,{ isStatic: true});

    var dball = this.matter.add.image(450*units+rXShift,600*units,'blockR').setBounce(.5).setFriction(0);
    dball.setScale(0.09,0.09);
    var pball = this.matter.add.image(530*units+rXShift,600*units,'blockR').setBounce(.5).setFriction(0);
    pball.setScale(0.09,0.09);
    dball.setCircle(26);
    pball.setCircle(26);


    //slings
    var dot = this.matter.add.rectangle(370*units+rXShift,400*units,1,1,{ isStatic: true});
    var ddot = this.matter.add.rectangle(450*units+rXShift,400*units,1,1,{ isStatic: true});
    var sling = this.matter.add.constraint(ballR,dot,200,0.05);
    var sling2 = this.matter.add.constraint(dball,ddot,200,0.05);
    var dddot = this.matter.add.rectangle(530*units+rXShift,400*units,1,1,{ isStatic: true});
    var dsling = this.matter.add.constraint(pball,dddot,200,0.05);

    let plat = this.matter.add.image(640*units+rXShift,700*units,'r').setScale(20,40).setStatic(true);
    let plat2 = this.matter.add.image(760*units+rXShift,1240*units,'r').setScale(20,60).setStatic(true);

    let plat5 = this.matter.add.image(1300*units+rXShift,900*units,'r').setScale(600,20);
    var pdot = this.matter.add.rectangle(1300*units+rXShift,900*units,1,1,{ isStatic: true});
    var psling = this.matter.add.constraint(plat5,pdot,0,1);

    let plat6 = this.matter.add.image(1800*units+rXShift,800*units,'r').setScale(300,20);
    var pdot6 = this.matter.add.rectangle(1800*units+rXShift,800*units,1,1,{ isStatic: true});
    var psling6 = this.matter.add.constraint(plat6,pdot6,0,1);

    var pball = this.matter.add.image(1700*units+rXShift,600*units,'blockR').setBounce(.5).setFriction(0);
    pball.setScale(0.1,0.1);
    var pdot7 = this.matter.add.rectangle(1700*units+rXShift,400*units,1.5,1.5,{ isStatic: true});
    var psling7 = this.matter.add.constraint(pball,pdot7,200,1);

    let platform = this.matter.add.image(1800*units+rXShift,700*units,'r').setScale(25,20).setStatic(true);

    stayStill.push(this.matter.add.image(910*units+rXShift,450*units,'g').setScale(5,100));
    stayStill.push(this.matter.add.image(970*units+rXShift,450*units,'g').setScale(5,100));
    stayStill.push(this.matter.add.image(1020*units+rXShift,450*units,'g').setScale(5,100));
    stayStill.push(this.matter.add.image(1070*units+rXShift,450*units,'g').setScale(5,100));
    stayStill.push(this.matter.add.image(1120*units+rXShift,450*units,'g').setScale(20,120));
    stayStill.push(this.matter.add.image(1800*units+rXShift,650*units,'blockR').setBounce(.5).setFriction(0).setFrictionAir(.5).setScale(0.15,0.15).setCircle(30));
    stayStill.push(this.matter.add.image(1300*units+rXShift,450*units,'blockR').setBounce(.5).setFriction(0).setScale(0.1,0.1).setCircle(15));
    stayStill.push(this.matter.add.image(640*units+rXShift,650*units,'blockR').setBounce(.5).setFriction(0).setScale(0.09,0.09));
    stayStill.push(this.matter.add.image(760*units+rXShift,500*units,'g').setScale(5,1000));

    // var balloon = this.matter.add.image(1860*units+rXShift,600*units,'blockR',null,{label:'ramp'});
    // balloon.setIgnoreGravity(true);
    // balloon.setScale(0.09,0.09);

    var lastP =  this.matter.add.image(-200+kXShift,-100+kYShift, 'orangeP', null, {isStatic:true, isSensor:true, label:"portal2"}).setScale(.25);
    //Kaustubha
    // var blockB = this.matter.add.image(120+kXShift, 0+kYShift, 'blockK').setMass(10);
    // blockB.setIgnoreGravity(true);
    var still = this.matter.add.image(1200+kXShift, 200+kYShift, 'blockK', null, {isStatic:true}).setMass(13);
    this.matter.add.image(0+kXShift, 700+kYShift, 'platform', null, { isStatic: true, width: 1 }).setScale(6, 0.5).setAngle(0);
    this.matter.add.image(0+kXShift, 60+kYShift, 'platform', null, { isStatic: true, width: 1 }).setScale(1.2, 0.3).setAngle(10);
    this.matter.add.image(670+kXShift, 600+kYShift, 'tube', null, {isStatic:true, width:0.5}).setScale(0.1, 0.5);
    this.matter.add.image(330+kXShift, 600+kYShift, 'triangle',null, { isStatic: true, width: 1 }).setScale(1, 1);
    var ss =  this.matter.add.image(340+kXShift, 600+kYShift, 'platform', null, {width: 1}).setScale(1, 0.5).setAngle(10).setMass(0.5);
    var ramp = this.matter.add.image(900+kXShift, 500+kYShift, 'platform', null, { isStatic:true, width: 1,label:"ramp" }).setScale(1, 0.5).setAngle(13);
    var blockC = this.matter.add.image(709+kXShift, 395+kYShift, 'blockK', null, {isStatic:true,label:"blockC"}).setMass(2).setAngle(13);
    var blockD = this.matter.add.image(1100+kXShift, 460+kYShift, 'blockK',null, {isStatic:true}).setMass(2).setAngle(13);
    // var string =     this.matter.add.image(1200+kXShift, 230+kYShift, 'tube', null, { width:0.5}).setScale(0.1, 5);
    var x= 1190+kXShift;
    still.setFixedRotation();
    this.matter.add.joint(still, blockD);
    // this.matter.add.joint(string, blockD);
    var dominoesK = []
    for (var i =0; i<3; i++){
        dominoesK.push(this.matter.add.image(x, 600+kYShift, 'dominoK').setScale(0.5, 1.9));
        x=x+10;
    }



}
function makeStatic(){
    for (i = 0; i<stayStill.length; i++){
        stayStill[i].setIgnoreGravity(true);
    }
}
function releaseStatic(){
    for (i = 0; i<stayStill.length; i++){
        stayStill[i].setIgnoreGravity(false);
    }
    return;
}


function update() {
    this.cameras.main.setZoom(zoomN);
    if (inpsK.up.isDown){
        // this.cameras.main.startFollow(ballJ, true);
        if(zoomN<1.5){
            zoomN+=.05;
        }
    }
    if (inpsK.down.isDown){
        // this.cameras.main.startFollow(ballJ, false);
        if(zoomN>.25){
            zoomN-=.05;
        }
    }


    if(inpsM.isDown) {
        // console.log(ballJ.x);
        // console.log('X:' + inpsM.x);

        // console.log('Y:' + inpsM.y);
    }
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


