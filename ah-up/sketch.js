// canvas width and height
var screenHeight = 600;
var screenWidth = 400;

var mic;
var rocket;
var obstacles;
var coins;
var smoke;

var cheatMode = false;

var rocketHeight;
var score;
var rocketImage;

var bgImage;
var bgy = -7500;

var comets = [];

var theCanvas;

// 0 - start state
// 1 - playing state
// 2 - game over animation
// 3 - game over screen
var state = 0;

function preload() {
    bgImage = loadImage("images/sky.png");
    rocketImage = loadImage("images/rocket.png");
    landImage = loadImage("images/land.png")
}

function setup() {
    mic = new p5.AudioIn();
    theCanvas = createCanvas(screenWidth, screenHeight);
    theCanvas.parent("#game");
    theCanvas.style('display', 'block');
    theCanvas.style('margin', 'auto');
    mic.start();
    comets.push(loadImage("images/comet-blue.png"));
    comets.push(loadImage("images/comet-red.png"));
    comets.push(loadImage("images/comet-orange.png"));
    noStroke();
}

function setupGame() {
    bgy = -7500;
    rocketHeight = 0;
    score = 0;
    rocket = new Rocket(screenWidth / 2, screenHeight / 2, mic, rocketImage);

    obstacles = [];
    for (var i = 0; i < 3; i++) {
        obstacles.push(new Obstacle(random(100, 400), random(-100, 0), random(30, 60), comets[int(random(0, 2))]));
    }

    coins = [];
    for (i = 0; i < 3; i++) {
        coins.push(new Coin(random(100, 400), random(-100, 0)));
    }

    smoke = [];
}

function draw() {
    switch (state) {
        case 0:
            drawStart();
            break;
        case 1:
            drawPlaying();
            break;
        case 2:
            drawGameOver();
            break;
        case 3:
            drawGameOverScreen();
            break;
    }
}

function drawBackground(acc) {
    background(255);
    imageMode(CENTER);
    image(bgImage, screenWidth / 2, bgy, 400, 20611);
    bgy += acc;
    if (bgy >= 16000) bgy = -10000;
}

function drawStart() {
    imageMode(CORNER);
    background(188,236,254, 50);
    drawCloud(20, 30);
    drawCloud(100, 90);
    drawCloud(300, 50);
    drawCloud(400, 100);

    push();
    translate(screenWidth - 90, screenHeight / 2 - 110);
    rotate(radians(30));
    image(rocketImage, 0, 0, 50, 100);
    pop();

    textAlign(CENTER);
    textSize(36);
    fill(0);
    textStyle(BOLD);
    text("Ah-Up!", screenWidth / 2, screenHeight / 2 - 40);
    fill(100);
    text("Press 'S' to Play!", screenWidth / 2, screenHeight / 2 + 50);
    textSize(24);
    text("Press 'C' to Play with Arrow Keys!\n(and Voice)", screenWidth / 2, screenHeight / 2 + 100);
    textStyle(NORMAL);

    image(landImage, 0, screenHeight-200, screenWidth,200);
}

var rot = 0;

function drawGameOver() {
    drawBackground(0);
    rocket.fire = false;

    for (var c = 0; c < coins.length; c++) {
        var coin = coins[c];
        if (coin.display()) {
            coins.splice(c, 1);
            c--;
            coins.push(new Coin(random(100, 400), random(-100, 0)));
        }
    }

    for (var i = 0; i < obstacles.length; i++) {
        var e = obstacles[i];
        if (e.display()) {
            obstacles.splice(i, 1);
            i--;
            obstacles.push(new Obstacle(random(100, 400), random(-100, 0), random(30, 60), comets[int(random(0, 2))]));
        }
    }

    push();
    translate(rocket.x, rocket.y);
    rotate(radians(rot));
    image(rocket.rocketImage, 0, 0, rocket.width, rocket.height);
    pop();

    rot += 5;
    if (rot >= 360) rot -= 360;
    rocket.y += 3;

    if (rocket.y >= screenHeight) {
        state = 3;
    }

}

function drawGameOverScreen() {
    imageMode(CORNER);
    background(188,236,254, 50);
    drawCloud(20, 30);
    drawCloud(100, 90);
    drawCloud(300, 50);
    drawCloud(400, 100)

    rectMode(CENTER);
    textAlign(CENTER);
    textSize(30);
    fill(0);
    textStyle(BOLD);
    text("Game Over!", screenWidth / 2, screenHeight / 2 - 50);
    fill(100);
    textSize(20);
    text("You reached a max height of " + rocketHeight + "\nand collected " + score + " coins along the way!",
        screenWidth / 2, screenHeight / 2);
    text("Press 'R' to Restart!", screenWidth / 2, screenHeight / 2 + 100);
    textStyle(NORMAL);

    var x = random(rocket.x-18, rocket.x-6);
    smoke.push(new SmokeParticle(x, screenHeight - 125, -1));
    for (var s = 0; s < smoke.length; s++) {
        var sm = smoke[s];
        if (sm.display()) {
            smoke.splice(s, 1);
            s--;
        }
    }

    push();
    translate(rocket.x, screenHeight - 100);
    rotate(radians(200));
    image(rocketImage, 0, -75, 50, 100);
    pop();
    rectMode(CORNER);
    fill(14, 89, 1);
    //rect(0, screenHeight - 70, screenWidth, 70);
    imageMode(CORNER)
    image(landImage, 0, screenHeight-200, screenWidth,200);
}

function drawPlaying() {
    textSize(24);

    var micLevel = mic.getLevel();
    drawBackground(map(micLevel, 0, 1, 2, 80));

    if (rocket.y >= screenHeight - rocket.height) {
        state = 2;
    }

    for (var c = 0; c < coins.length; c++) {
        var coin = coins[c];
        if (rocket.checkCollisionWithCircle(coin.x, coin.y, coin.size)) {
            coins.splice(c, 1);
            c--;
            coins.push(new Coin(random(100, 400), random(-100, 0)));
            score++;
        }
        if (coin.display()) {
            coins.splice(c, 1);
            c--;
            coins.push(new Coin(random(100, 400), random(-100, 0)));
        }
    }

    for (var i = 0; i < obstacles.length; i++) {
        var e = obstacles[i];
        if (rocket.checkCollisionWithCircle(e.x, e.y + e.height / 3.5, e.width / 1.2)) {
            state = 2;
        }
        if (e.display()) {
            obstacles.splice(i, 1);
            i--;
            obstacles.push(new Obstacle(random(100, 400), random(-100, 0), random(30, 60), comets[int(random(0, 2))]));
        }
    }

    // fill(150, 200, 255, 90);
    strokeWeight(1);
    stroke(0);
    fill(250);
    rect(0, 0, 150, 60);
    noStroke();
    fill(200, 200, 200);
    textAlign(LEFT);
    textSize(20);
    fill(0);
    text("Height: " + rocketHeight, 10, 30);
    text("Score: " + score, 10, 50);

    rocketHeight += 1;

    rocket.displayFlying(state);

    drawEnergyBar(micLevel);

    stroke(255, 0, 0);
    strokeWeight(1);
    textAlign(CENTER);
    fill(255, 0, 0);
    text("DANGER!", screenWidth / 2, screenHeight - 100);
    line(0, screenHeight - 83, screenWidth, screenHeight - 83);
    strokeWeight(0);
}

function keyPressed() {
    if (state === 0) {
        if (keyCode === 83 || keyCode === 67) {
            setupGame();
            state = 1;
            if (keyCode === 67) {
                cheatMode = true;
            } else {
                cheatMode = false;
            }
        }
    } else if (state === 3) {
        if (keyCode === 82) {
            state = 0;
        }
    }
}

function drawEnergyBar(micLevel) {

    var red = 0;
    var green = 0;

    rectMode(CORNER);
    fill(200, 200, 200, 80);
    strokeWeight(1);
    stroke(0);
    rect(width - 40, height - 300, 30, 200);
    fill(0);
    var h = map(micLevel, 0, 1, 0, 200);
    if (h < 100) {
        red = 255;
        green = map(h, 0, 100, 0, 255);
    } else {
        red = map(h, 0, 100, 0, 255);
        green = 255;
    }

    noStroke();
    fill(red, green, 0, 80);
    rect(width - 38, height - 300 + (200 - h), 26, h);

}

function drawCloud(x, y){
    fill("while");
    ellipse(x,y, 50,20);
    ellipse(x+40,y, 50,20);
    ellipse(x+20,y-10, 50,20);
}