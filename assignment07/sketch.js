var capture;
var compareFrame;

var threshold = 20;

var score;

var ufoImage;
var ufos;
var blast;

var theCanvas;

function preload() {
    ufoImage = loadImage('images/UFO.png');
    blast = loadImage('images/blast.png');
}

function setup() {
    theCanvas = createCanvas(500, 500);
    theCanvas.parent("#game");
    theCanvas.style('display', 'block');
    theCanvas.style('margin', 'auto');
    score = 0;

    capture = createCapture({
        video: {
            mandatory: {
                minWidth: 500,
                minHeight: 500,
                maxWidth: 500,
                maxHeight: 500
            }
        }
    });
    capture.hide();

    compareFrame = new p5.Image(500, 500);

    ufos = [];
    for (var i = 0; i < 5; i++) {
        ufos.push(new Ufo(random([-1, 1])));
    }

    textSize(32);
    fill(255);
    stroke(0);
    strokeWeight(3);
}

function draw() {

    background(255);

    capture.loadPixels();
    compareFrame.loadPixels();

    if (capture.pixels.length > 0) {

        image(capture, 0, 0);

        for (var i = 0; i < ufos.length; i++) {
            ufos[i].display();
            if (ufos[i].isExploding) {
                if (ufos[i].opacity <= 0) {
                    ufos.splice(i, 1);
                    i--;
                    ufos.push(new Ufo(random([-1, 1])));
                }
            } else if (ufos[i].move()) {
                ufos.splice(i, 1);
                i--;
                ufos.push(new Ufo(random([-1, 1])));
            }
        }

        checkHits();
        compareFrame.copy(capture, 0, 0, 500, 500, 0, 0, 500, 500);

        text("Score: " + score, 10, 30);
    }
}

function checkHits() {
    for (var i = 0; i < ufos.length; i++) {
        var x = round(ufos[i].x);
        var y = round(ufos[i].y);

        var loc = (x + y * 500) * 4;

        var change = dist(capture.pixels[loc], capture.pixels[loc + 1],
            capture.pixels[loc + 2], compareFrame.pixels[loc],
            compareFrame.pixels[loc + 1], compareFrame.pixels[loc + 2]);

        if (change > threshold && !ufos[i].isExploding) {
            score++;
            ufos[i].isExploding = true;
        }
    }
}

function Ufo(d) {

    this.isExploding = false;
    this.opacity = 255;
    if (d < 0) {
        this.x = 500;
    } else {
        this.x = 0;
    }
    this.y = random(0, 500);
    this.direction = d;
    this.noiseX = random(0,1000);
    this.noiseY = random(4000,5000);

    this.display = function() {
        if (this.isExploding) {
            tint(255, this.opacity);
            image(blast, this.x, this.y, 40, 40);
            tint(255, 255);
            this.opacity -= 5;
        } else {
            image(ufoImage, this.x, this.y, 40, 60);
        }
        return true;
    };

    this.move = function () {
        var moveX = map(noise(this.noiseX), 0, 1, 1, 3) * this.direction;
        var moveY = map(noise(this.noiseY), 0, 1, -3, 3);
        this.x += moveX;
        this.y += moveY;
        this.noiseX += 0.01;
        this.noiseY += 0.01;
        return this.x < 0 || this.x > 500 || this.y < 0 || this.y > 500;
    };

}
