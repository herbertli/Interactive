function Obstacle(x, y, width, comet) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width * 2.5;
    this.speed = random(1, 5);

    this.comet = comet;

    this.display = function () {
        fill(0);
        imageMode(CENTER);
        image(this.comet, this.x, this.y, this.width, this.height);
        this.y += this.speed;
        return this.y >= screenHeight;
    };
}