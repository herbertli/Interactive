var world;
var snowmen = [];
var snow = [];
var silentNight;
var userPos;

function preload() {
    soundFormats('ogg', 'mp3');
    silentNight = loadSound('sounds/silentNight.mp3');
}

function setup() {
    noCanvas();

    silentNight.loop();

    world = new World('VRScene');
    world.add(new Plane({
        x: 0,
        y: 0,
        z: 0,
        width: 50,
        height: 50,
        asset: "ground",
        repeatX: 10,
        repeatY: 10,
        rotationX: -90
    }));
    userPos = world.getUserPosition();

    for (var i = 0; i < 10; i++) {
        new Tree(random(-25, 25), 0, random(-25, 25), random(10, 20), 1);
    }

    for (var i = 0; i < 5; i++) {
        snowmen.push(new Snowman(random(-25, 25), random(-25, 25)));
    }

    for (var i = 0; i < 100; i++) {
        snow.push(new Snow());
    }

}

function draw() {
    for (var i = 0; i < snowmen.length; i++) {
        snowmen[i].move();
    }
    for (var i = 0; i < snow.length; i++) {
        snow[i].move();
    }
    userPos = world.getUserPosition();
}

function mousePressed() {
    if (userPos.x >= -25 && userPos.x <= 25 && userPos.z >= -25 && userPos.z <= 25)
        world.moveUserForward(.05);
}

function Snow() {
    this.x = random(userPos.x - 10, userPos.x + 10);
    this.y = random(5, 10);
    this.z = random(userPos.z - 10, userPos.z + 10);
    this.radius = .05;

    this.myShape = new Sphere({
        x: this.x,
        y: this.y,
        z: this.z,
        red: 250,
        green: 250,
        blue: 250,
        radius: this.radius
    });
    world.add(this.myShape);

    this.move = function() {
        this.myShape.nudge(0, -.03, 0);
        if (this.myShape.getY() <= 0) {
            this.y = random(5, 10);
            this.myShape.setY(this.y);
            this.x = random(userPos.x - 10, userPos.x + 10);
            this.z = random(userPos.z - 10, userPos.z + 10);
            this.myShape.setX(this.x);
            this.myShape.setZ(this.z);
        }
    }

}

function Tree(x, y, z, height, radius) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.height = height;
    this.radius = radius;

    world.add(new Cylinder({
        x: this.x,
        y: this.y,
        z: this.z,
        red: 105,
        green: 66,
        blue: 0,
        radius: this.radius / 4,
        height: this.height / 2
    }));
    world.add(new Cone({
        x: this.x,
        y: this.y + this.height / 4,
        z: this.z,
        red: 0,
        green: 255,
        blue: 0,
        radiusTop: 0,
        radiusBottom: this.radius * 3,
        height: this.height / 3
    }));
    world.add(new Cone({
        x: this.x,
        y: this.y + this.height / 2,
        z: this.z,
        red: 0,
        green: 255,
        blue: 0,
        radiusTop: 0,
        radiusBottom: this.radius * 2,
        height: this.height / 3
    }));
    world.add(new Cone({
        x: this.x,
        y: this.y + this.height / 4 * 3,
        z: this.z,
        red: 0,
        green: 255,
        blue: 0,
        radiusTop: 0,
        radiusBottom: this.radius,
        height: this.height / 3
    }));
}

function Snowman(x, z) {
    this.x = x;
    this.y = 0;
    this.z = z;
    this.size = 1;
    this.nextY = .5;

    this.noiseX = random(0,1000);
    this.noiseZ = random(4000,5000);

    this.createBox = function(size, y) {
        return new Box({
            x: 0,
            y: y,
            z: 0,
            red: 200,
            green: 200,
            blue: 200,
            height: size,
            width: size,
            depth: size,
            clickFunction: function (e) {
                if (e.snowmanRef.size === 0) return;
                e.clickFunction = null;
                e.snowmanRef.size -= .25;
                e.snowmanRef.nextY += e.snowmanRef.size;
                var b = e.snowmanRef.createBox(e.snowmanRef.size, e.snowmanRef.nextY);
                b.snowmanRef = e.snowmanRef;
                e.snowmanRef.snowmanContainer.addChild(b);
            }
        });
    };

    this.snowmanContainer = new Container3D({
        x: this.x,
        y: this.y,
        z: this.z
    });
    var b = this.createBox(this.size, this.nextY);
    b.snowmanRef = this;
    this.snowmanContainer.addChild(b);
    world.add(this.snowmanContainer);

    this.move = function() {
        var moveX = map(noise(this.noiseX), 0, 1, -0.03, 0.03);
        var moveZ = map(noise(this.noiseZ), 0, 1, -0.03, 0.03);
        this.snowmanContainer.nudge(moveX, 0, moveZ);
        this.snowmanContainer.constrainPosition(-25, 25, 0, 10, -25, 25);
        this.noiseX += 0.01;
        this.noiseZ += 0.01;
    }

}