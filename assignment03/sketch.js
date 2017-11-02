// 0 - start screen
// 1 - playing
// 2 - pause
// 3 - game over screen
var state = 0;

// 0 - easy mode
// 1 - hard mode
var mode;

var theCanvas;

var player;
var enemy;
var objective;

var score;

var hitSound;
var badSound;

var goldImage;
var jewelryImage;
var moneyImage;
var robberImage;
var copImage;
var backgroundImage;

function updateLightD(theRange) {
    enemy.lightD = parseInt(theRange.value);
}

function updateLightR(theRange) {
    enemy.lightR = radians(parseInt(theRange.value));
}

function updatePSpeed(theRange) {
    player.speedX = parseInt(theRange.value);
    player.speedY = parseInt(theRange.value);
}

function preload() {
    soundFormats('ogg', 'mp3');
    badSound = loadSound('sounds/found.mp3');
    hitSound = loadSound('sounds/hit.mp3');

    copImage = loadImage('images/copImage.png');
    robberImage = loadImage('images/robberImage.png');
    backgroundImage = loadImage('images/backgroundImage.jpg');

    goldImage = loadImage('images/goldImage.png');
    jewelryImage = loadImage('images/jewelryImage.png');
    moneyImage = loadImage('images/moneyImage.png');
}

function setup() {
    theCanvas = createCanvas(500, 500);
    theCanvas.parent("#game");
}

function setupGame() {
    var speed = parseInt(select('#range3').value());
    var lightR = radians(parseInt(select('#range2').value()));
    var lightD = parseInt(select('#range1').value());

    player = new Player(speed);
    enemy = new Enemy(lightR, lightD);
    enemy.setup();

    objective = new Objective();
    score = 0;
}

function draw() {
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);

    switch (state) {
        case 0:
            drawStart();
            break;
        case 1:
            drawPlaying();
            break;
        case 2:
            drawPaused();
            break;
        case 3:
            drawGameOver();
            break;
    }
}

function drawPlaying() {
    player.display();
    enemy.display();
    objective.display();

    if (state === 1) {
        player.move();
        if (enemy.isRotating)
            enemy.rotate();
        else
            enemy.move();
        checkCollisions();
    }

    // text
    fill(255);
    textAlign(LEFT);
    text("Score: " + score, 10, 30);
}

function checkCollisions() {
    if (player.checkCollision(enemy)) {
        textAlign(CENTER);
        textSize(36);
        fill(0);
        state = 3;
        badSound.play();
    } else if (player.checkCollision(objective)) {
        score += 1;
        hitSound.play();
        objective = new Objective();
    }
}

function drawPaused() {
    drawPlaying();
    textAlign(CENTER);
    textSize(36);
    fill(255);
    text("Paused, press 'P' to resume", width / 2, height / 2);
}

function drawGameOver() {
    drawPlaying();
    textAlign(CENTER);
    textSize(36);
    fill(255);
    text("GAME OVER\nPress 'R' to Restart", width / 2, height / 2);
}

function drawStart() {
    textAlign(CENTER);
    textSize(36);
    fill(255);
    text("Please select a difficulty:", width / 2, height / 2);

    fill(150);
    rectMode(CENTER);
    rect(width / 2, height / 2 + 30, 100, 50);
    rect(width / 2, height / 2 + 100, 100, 50);

    fill(255);
    text("Easy", width / 2, height / 2 + 40);
    text("Hard", width / 2, height / 2 + 110);

}

function mousePressed() {
    if (state === 0) {
        if (Math.abs(mouseX - width / 2) <= 50 && Math.abs(mouseY - height / 2 - 30) <= 25) {
            state = 1;
            mode = 0;
        } else if (Math.abs(mouseX - width / 2) <= 50 && Math.abs(mouseY - height / 2 - 100) <= 25) {
            state = 1;
            mode = 1;
        }
        setupGame();
    }
}

function keyPressed() {
    if (state === 1 && keyCode === 'P'.charCodeAt(0)) {
        state = 2;
    } else if (state === 2 && keyCode === 'P'.charCodeAt(0)) {
        state = 1;
    } else if (state === 3 && keyCode === 'R'.charCodeAt(0)) {
        state = 0;
    }
}

function Objective() {

    this.diameter = random(25, 50);
    this.x = random(this.diameter, width - this.diameter);
    this.y = random(this.diameter, height - this.diameter);
    this.imageIcon = int(random(0, 3));

    this.display = function () {
        imageMode(CENTER);
        if (this.imageIcon === 0)
            image(goldImage, this.x, this.y, this.diameter, this.diameter);
        else if (this.imageIcon === 1)
            image(jewelryImage, this.x, this.y, this.diameter, this.diameter);
        else
            image(moneyImage, this.x, this.y, this.diameter, this.diameter);
    }
}

function Enemy(initialR, initialD) {

    this.diameter = 25;
    this.x = this.diameter;
    this.y = this.diameter;
    this.lightR = initialR;
    this.lightD = initialD;

    if (mode === 0)
        this.speed = 1;
    else
        this.speed = 3;

    this.deg = 0;
    this.currentDeg = 0;
    this.counter = 0;
    this.turnR = 0;

    this.display = function () {

        fill(255, 255, 0, 100);
        arc(this.x, this.y, this.lightD, this.lightD, this.currentDeg - this.lightR / 2, this.currentDeg + this.lightR / 2);

        fill(255, 0, 0);
        ellipse(this.x, this.y, this.diameter, this.diameter);

        imageMode(CENTER);
        image(copImage, this.x, this.y - this.diameter / 2, this.diameter, this.diameter);

    };

    this.setup = function () {
        this.destX = random(0, width);
        this.destY = random(0, height);

        var distX = this.destX - this.x;
        var distY = this.destY - this.y;
        var distH = dist(this.x, this.y, this.destX, this.destY);
        this.speedX = distX / distH * this.speed;
        this.speedY = distY / distH * this.speed;
        this.deg = acos(this.speedX / this.speed);
        if (this.speedY <= 0) this.deg = 2 * PI - this.deg;
        this.turnR = (this.deg - this.currentDeg) / 60;

        this.isRotating = true;

    };

    this.rotate = function () {
        this.currentDeg += this.turnR;
        this.counter++;
        if (this.counter === 60) {
            this.currentDeg = this.deg;
            this.isRotating = false;
            this.counter = 0;
        }
    };

    this.move = function () {

        this.x += this.speedX;
        this.y += this.speedY;

        if (dist(this.x, this.y, this.destX, this.destY) < 10) {
            this.setup();
        }

    };

}

function Player(initialSpeed) {

    this.diameter = 25;
    this.x = width - this.diameter;
    this.y = height - this.diameter;
    this.speedX = initialSpeed;
    this.speedY = initialSpeed;

    this.move = function () {
        if (keyIsDown("W".charCodeAt(0))) {
            if (this.y - this.speedY >= 0)
                this.y -= this.speedY;
            else
                this.y = 0;
        }
        if (keyIsDown("A".charCodeAt(0))) {
            if (this.x - this.speedX >= 0)
                this.x -= this.speedX;
            else
                this.x = 0;
        }
        if (keyIsDown("S".charCodeAt(0))) {
            if (this.y + this.speedY <= height)
                this.y += this.speedY;
            else
                this.y = height;
        }
        if (keyIsDown("D".charCodeAt(0))) {
            if (this.x + this.speedX <= width)
                this.x += this.speedX;
            else
                this.x = width;
        }

    };

    this.checkCollision = function (obj) {
        if (obj instanceof Enemy) {
            var distance = dist(this.x, this.y, obj.x, obj.y);
            var ang = acos((this.x - obj.x) / distance);
            if (this.y <= obj.y) ang = 2 * PI - ang;
            return distance <= obj.lightD / 2 &&
                Math.abs(ang - obj.currentDeg) <= obj.lightR / 2;
        } else if (obj instanceof Objective) {
            return dist(this.x, this.y, obj.x, obj.y) < obj.diameter / 2 + this.diameter / 2;
        }
        return false;
    };

    this.display = function () {
        fill(255);
        ellipse(this.x, this.y, this.diameter, this.diameter);
        imageMode(CENTER);
        image(robberImage, this.x - 2, this.y, this.diameter, this.diameter);
    }

}