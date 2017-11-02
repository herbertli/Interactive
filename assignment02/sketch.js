var wallThickness = 10;

var paddleWidth = 100;
var paddleHeight = 10;
var paddleX;
var paddleY;

var ballR = 10;
var ballX;
var ballY;
var ballSpeedX;
var ballSpeedY;

var objX;
var objY;
var objR = 20;

var score = 0;
var misses = 0;

var boingSound;
var missSound;
var hitSound;

var backgroundImage;
var objImage;

function preload() {
    soundFormats('ogg', 'mp3');
    boingSound = loadSound('sounds/boing.mp3');
    missSound = loadSound('sounds/miss.mp3');
    hitSound = loadSound('sounds/hit.mp3');

    backgroundImage = loadImage('images/background.png');
    objImage = loadImage('images/obj.png');
}

function setup() {

    createCanvas(500, 500);
    background(0);

    paddleX = width / 2;
    paddleY = height - paddleHeight / 2;

    ballSpeedX = random(-3, 3);
    ballSpeedY = random(-3, 3);
    ballX = width / 2;
    ballY = height / 2;

    objX = random(wallThickness + objR, width - wallThickness - objR);
    objY = random(wallThickness + objR, height - 200);

    noStroke();

}

function draw() {
    background(0);

    // draw background
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);

    // draw walls
    fill(100);
    rectMode(CORNER);
    rect(0, 0, width, wallThickness);
    rect(0, 0, wallThickness, height);
    rect(width - wallThickness, 0, wallThickness, height);

    // draw objects
    // paddle
    fill(200);
    rectMode(CENTER);
    rect(paddleX, paddleY, paddleWidth, paddleHeight);
    // objective
    imageMode(CENTER);
    image(objImage, objX, objY, objR * 2, objR * 2);
    // text
    fill(255);
    text("Score: " + score, 15, 25);
    text("Misses: " + misses, 15, 45);
    // ball
    fill(random(255), random(255), random(255));
    ellipse(ballX, ballY, ballR * 2, ballR * 2);

    // check location of ball and handle bounces
    if (hitPaddle()) {
        if (ballX < paddleX)
            ballSpeedX = (ballSpeedX > 0) ? ballSpeedX * -1 : ballSpeedX;
        else
            ballSpeedX = (ballSpeedX < 0) ? ballSpeedX * -1 : ballSpeedX;
        ballSpeedY *= -1.05;
        boingSound.play();
    } else if (ballY <= ballR + wallThickness) {
        ballSpeedY *= -1.1;
        boingSound.play();
    } else if (ballX <= ballR + wallThickness || ballX >= width - ballR - wallThickness) {
        ballSpeedX *= -1.05;
        boingSound.play();
    } else if (ballY >= paddleY) {
        missSound.play();
        ballX = width / 2;
        ballY = height / 2;
        ballSpeedX = random(-5, 5);
        ballSpeedY = random(-5, 5);
        misses++;
    }

    // check if ball has hit the objective
    if (hitObj()) {
        hitSound.play();
        score++;
        objX = random(wallThickness + objR, width - wallThickness - objR);
        objY = random(wallThickness + objR, height - 200);
    }

    // move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // move paddle
    if (keyIsDown(65)) {
        if (paddleX - paddleWidth / 2 - wallThickness - 5 >= 0)
            paddleX -= 5;
    } else if (keyIsDown(68)) {
        if (paddleX + paddleWidth / 2 + wallThickness + 5 <= width)
            paddleX += 5;
    }

}

function hitPaddle() {
    return ballY >= paddleY - paddleHeight / 2 - ballR &&
        ballX >= paddleX - paddleWidth / 2 - ballR &&
        ballX <= paddleX + paddleWidth / 2 + ballR;
}

function hitObj() {
    return dist(ballX, ballY, objX, objY) <= ballR + objR;
}
