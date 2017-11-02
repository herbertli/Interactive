function setup() {
    createCanvas(500, 500);

    background(54, 89, 160);

    fill(255);

    // let's draw the Lincoln Memorial...

    // outline of the building
    rect(100, 250, 300, 25);
    fill(240);
    rect(50, 300, 400, 300);
    fill(255);
    rect(25, 275, 450, 25);
    rect(25, 420, 450, 30);
    fill(0);
    rect(190, 300, 120, 120);

    // columns
    fill(255);
    for (var i = 0; i < 12; i++) {
        createColumn(27 + i * 39, 300);
    }

    // clouds (I tried)
    noStroke();
    for (i = 0; i < random(3, 6); i++) {
        createCloud(random(0, width), random(0, 150));
    }
    noStroke();

    // ground
    fill(137, 64, 0);
    rect(-10, 450, 600, 150);

}

function createCloud(x, y) {
    var cloudH = random(100, 150);
    var cloudW = random(100, 150);
    ellipse(x, y, cloudW, cloudH);
    ellipse(x + cloudW / 2, y, cloudW / 2, cloudH / 2);
    ellipse(x - cloudW / 2, y, cloudW / 2, cloudH / 2);
}

function createColumn(x, y) {
    rect(x + 3, y, 10, 120);
    rect(x, y, 16, 3);
    rect(x, y + 120 - 3, 16, 3);
}

function draw(){
}
