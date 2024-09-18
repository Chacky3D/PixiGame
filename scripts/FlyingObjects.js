class FlyingObject {
    constructor(container, app, speed) {
        this.container = container;
        this.app = app;
        this.speed = speed;
        this.radius = 15;
        this.flyingObject = new PIXI.Graphics();
        this.initflyingObject();
        this.setupClickListener();
    }

    initflyingObject() {
        this.flyingObject.interactive = true;

        this.angleToPlanet = Math.random() * Math.PI * 2;
        const spawnDistance = Math.max(this.app.screen.width, this.app.screen.height) / 2 + 100;

        this.flyingObject.x = Math.cos(this.angleToPlanet) * spawnDistance;
        this.flyingObject.y = Math.sin(this.angleToPlanet) * spawnDistance;

        this.container.addChild(this.flyingObject);
    }

    setupClickListener() {
        this.flyingObject.on('pointerdown', () => this.destroy());
    }

    destroy() {
        this.container.removeChild(this.flyingObject);
    }

    move() {
        this.flyingObject.x -= Math.cos(this.angleToPlanet) * this.speed;
        this.flyingObject.y -= Math.sin(this.angleToPlanet) * this.speed;
    }
}

export class Alien extends FlyingObject {
    initflyingObject(){
        super.initflyingObject()

        this.flyingObject.beginFill(0xff00ff);
        this.flyingObject.drawCircle(0, 0, this.radius);
        this.flyingObject.endFill();
    }
    checkCollision(projectile) {
        const distX = this.flyingObject.x - projectile.x;
        const distY = this.flyingObject.y - projectile.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        return distance < this.radius + 5;  // Cambiar ese +5 por el proyectileRadius de la clase proyectil
    }
}

export class Meteorite extends FlyingObject {
    initflyingObject(){
        super.initflyingObject()

        this.flyingObject.beginFill(0xffa500);
        this.flyingObject.drawCircle(0, 0, this.radius);
        this.flyingObject.endFill();
        
        // Agregar unos grados random para que no vaya hacia el planeta (de -0.6 a -0.12 o de 0.12 a 0.6)
        let randAngleIncrement = (Math.random() * (0.6 - 0.12)) + 0.12;
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        this.angleToPlanet += randAngleIncrement * plusOrMinus;
    }
}