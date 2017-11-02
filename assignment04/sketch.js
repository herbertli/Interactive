var moles;
var score;
var misses;
var state = 0;

var moleImage;
var hammerImage;
var crownImage;
var badImage;

var hitSound;
var missSound;
var wowSound;
var whoaSound;

var elaspedTime;
var maxTime = 30 * 60;

function preload() {
    soundFormats('ogg', 'mp3');

    moleImage = loadImage('images/moleImage.png');
    hammerImage = loadImage('images/hammerImage.png');
    crownImage = loadImage('images/crownImage.png');
    badImage = loadImage('images/badImage.png');

    missSound = loadSound('sounds/miss.mp3');
    hitSound = loadSound('sounds/hit.mp3');
    wowSound = loadSound('sounds/wow.mp3');
    whoaSound = loadSound('sounds/whoa.mp3');
}

function setup() {
    createCanvas(500, 500);
    imageMode(CENTER);
    noCursor();
    setupGame();
}

function setupGame() {
    elaspedTime = 0;
    moles = [];
    score = 0;
    misses = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            moles.push(new Mole(width / 4 + i * width / 4, height / 4 + j * height / 4))
        }
    }
}

function draw() {
    background(0);

    switch (state) {
        case 0:
            drawPaused();
            break;
        case 1:
            drawPlaying();
            break;
        case 2:
            drawGameOver();
            break;
    }
}

function drawPlaying() {

    fill(255);
    textSize(20);
    textAlign(LEFT);
    text("Score: " + score, 10, 30);
    text("Misses: " + misses, 10, 50);

    textAlign(CENTER);
    text(int((maxTime - elaspedTime) / 60), width / 2, 50);

    if (state === 1) {
        elaspedTime++;

        moles.forEach(function (e) {
            e.update()
        });
    }

    moles.forEach(function (e) {
        e.display()
    });

    image(hammerImage, mouseX, mouseY, 50, 50);

    if (elaspedTime === maxTime) {
        state = 2;
    }

}

function drawPaused() {
    drawPlaying();
    textAlign(CENTER);
    textSize(36);
    fill(0, 0, 255);
    text("Paused, press 'P' to resume", width / 2, height / 2);
}

function drawGameOver() {
    textAlign(CENTER);
    textSize(36);
    fill(0, 0, 255);
    text("GAME OVER\nYour Score: " + score + "\nPress 'R' to Restart", width / 2, height / 2 - 50);
}

function keyPressed() {
    if (state === 0 && keyCode === 'P'.charCodeAt(0)) {
        state = 1;
    } else if (state === 2 && keyCode === 'R'.charCodeAt(0)) {
        setupGame();
        state = 0;
    }
}

function Mole(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 50;
    this.state = 0;
    this.timer = random(60, 60 * 3);

    this.display = function() {
        fill(255);
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
        if (this.state === 0) {
            fill(0);
            ellipse(this.x, this.y, this.radius * 1.5, this.radius * 1.5);
        } else if (this.state === 1) {
            fill(0, 255, 0);
            ellipse(this.x, this.y, this.radius * 1.5, this.radius * 1.5);
            image(moleImage, this.x, this.y, this.radius * 1.5, this.radius * 1.5);
        } else if (this.state === 2) {
            fill(0, 255, 0);
            ellipse(this.x, this.y, this.radius * 1.5, this.radius * 1.5);
            image(crownImage, this.x, this.y - this.radius, this.radius, this.radius);
            image(moleImage, this.x, this.y, this.radius * 1.5, this.radius * 1.5);
        } else {
            fill(255, 0, 0);
            ellipse(this.x, this.y, this.radius * 1.5, this.radius * 1.5);
            image(badImage, this.x, this.y, this.radius * 1.2, this.radius * 1.5);
        }
    };

    this.update = function() {
        if (this.timer <= 0) {
            if (this.state > 0) {
                this.state = 0;
            } else {
                if (random() < .05) {
                    this.state = 2;
                } else if (random() < .1) {
                    this.state = 3;
                } else {
                    this.state = 1;
                }
            }
            this.timer = random(60, 60 * 3);
        } else {
            this.timer -= 1;
        }
    };

    this.checkHit = function() {
        return this.state > 0 && dist(mouseX, mouseY, this.x, this.y) <= this.radius;
    }

}

function mousePressed() {
    if (state === 1) {
        var hitOne = false;
        moles.forEach(function (e) {
            if (e.checkHit()) {
                if (e.state === 2) {
                    wowSound.play();
                    score += 3;
                } else if (e.state === 1) {
                    hitSound.play();
                    score += 1;
                } else {
                    whoaSound.play();
                    score -= 3;
                }
                e.state = 0;
                e.timer = random(60, 60 * 3);
                hitOne = true;
            }
        });
        if (!hitOne) {
            misses++;
            missSound.play();
        }
    }
}