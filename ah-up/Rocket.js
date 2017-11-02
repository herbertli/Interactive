function Rocket(x, y, mic, rocketImage) {
    this.x = x;
    this.y = y;
    this.fire = false;
    this.speed = 0;
    this.width = 46;
    this.height = 83;
    this.mic = mic;
    this.rocketImage = rocketImage;
    this.smokeParticles = [];

    this.displayFlying = function (state) {
        imageMode(CENTER);
        image(this.rocketImage, this.x, this.y, this.width, this.height);

        if (this.fire) {
            noStroke();
            var x = random(this.x - 10, this.x + 10);
            this.smokeParticles.push(new SmokeParticle(x, this.y + 40, 1));
        }

        for (var i = 0; i < this.smokeParticles.length; i++) {
            if (this.smokeParticles[i].display()) {
                this.smokeParticles.splice(i, 1);
            }
        }

        fill(100, 0, 0, 50);
        // probably should comment this out in the final version as well
        // triangle(this.x, this.y - this.height / 2, //upper point
        //     this.x - this.width / 2, this.y + 28, //left point
        //     this.x + this.width / 2, this.y + 28);

        if (state === 1) this.updateFlying(this.mic.getLevel());
        else this.y += 3;
    };

    this.updateFlying = function (micLevel) {

        var level = map(micLevel, 0, 1, 0, 100);

        if (level > 10) { //filter out bg noise
            if (this.y > 100) {
                this.y = this.y - micLevel * 50;
                this.fire = true;
            }
        } else {
            this.fire = false;
        }

        if (this.y < height) {
            this.y += 3;
        }

        if (cheatMode) {
            //make sure this is commented out in the final version
            if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
                this.y = constrain(this.y - 5, 0, screenHeight - 50);
                this.fire = true;
            }

            if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
                this.y = constrain(this.y + 5, 0, screenHeight - 50);
            }
        }

        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            this.x = constrain(this.x - 7, 0, screenWidth);
        }

        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            this.x = constrain(this.x + 7, 0, screenWidth);
        }
    };

    this.checkCollisionWithRectangle = function (x, y, width, height) {
        var poly = [];
        poly[0] = createVector(this.x, this.y - this.height / 2);     // set X/Y position
        poly[1] = createVector(this.x - this.width / 2, this.y + 28);
        poly[2] = createVector(this.x + this.width / 2, this.y + 28);
        return collideRectPoly(x, y, width, height, poly);
    };

    this.checkCollisionWithCircle = function (x, y, diameter) {
        var poly = [];
        poly[0] = createVector(this.x, this.y - this.height / 2);     // set X/Y position
        poly[1] = createVector(this.x - this.width / 2, this.y + 28);
        poly[2] = createVector(this.x + this.width / 2, this.y + 28);
        return collideCirclePoly(x, y, diameter, poly);
    };
}

function SmokeParticle(x, y, direction) {
    this.x = x;
    this.y = y;
    this.speed = 5 * direction;
    this.size = random(10, 30);
    this.color = random(0, 200);
    this.opacity = random(20, 80);

    this.display = function () {
        fill(this.color, this.color, this.color, this.opacity--);
        ellipse(this.x, this.y, this.size, this.size);
        this.y += this.speed;
        return this.y >= screenHeight || this.y <= 0 || this.opacity === 0;
    }
}