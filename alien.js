export class Alien {
    constructor(container, app, alienSpeed) {
        this.container = container;
        this.app = app;
        this.alienSpeed = alienSpeed;
        this.radius = 15;
        this.alien = new PIXI.Graphics();
        this.initAlien();
        this.setupClickListener();
    }

    initAlien() {
        this.alien.beginFill(0xff00ff);
        this.alien.drawCircle(0, 0, this.radius);
        this.alien.endFill();

        this.alien.interactive = true;
        this.alien.buttonMode = true;

        this.angleToPlanet = Math.random() * Math.PI * 2;
        const spawnDistance = Math.max(this.app.screen.width, this.app.screen.height) / 2 + 100;

        this.alien.x = Math.cos(this.angleToPlanet) * spawnDistance;
        this.alien.y = Math.sin(this.angleToPlanet) * spawnDistance;

        this.container.addChild(this.alien);
    }

    setupClickListener() {
        this.alien.on('pointerdown', () => this.destroy());
    }

    destroy() {
        this.container.removeChild(this.alien);
    }

    moveTowardsPlanet() {
        this.alien.x -= Math.cos(this.angleToPlanet) * this.alienSpeed;
        this.alien.y -= Math.sin(this.angleToPlanet) * this.alienSpeed;
    }

    checkCollision(projectile) {
        const distX = this.alien.x - projectile.x;
        const distY = this.alien.y - projectile.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        return distance < this.radius + 5;  // 5 es el radio del proyectil
    }
}