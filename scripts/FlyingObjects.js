import { container, app } from './GameManager.js';

class FlyingObject 
{

    constructor() 
    {
        this.speed;
        this.radius = 15;
        this.flyingObject = new PIXI.Graphics();
        this.initflyingObject();
        this.setupClickListener();
    }

    initflyingObject() 
    {
        this.flyingObject.interactive = true;

        this.angleToPlanet = Math.random() * Math.PI * 2;
        const spawnDistance = Math.max(app.screen.width, app.screen.height) / 2 + 100;

        this.flyingObject.x = Math.cos(this.angleToPlanet) * spawnDistance;
        this.flyingObject.y = Math.sin(this.angleToPlanet) * spawnDistance;

        container.addChild(this.flyingObject);
    }

    setupClickListener() 
    {
        this.flyingObject.on('pointerdown', () => this.destroy());
    }

    destroy() 
    {
        container.removeChild(this.flyingObject);
    }

    move() 
    {
        this.flyingObject.x -= Math.cos(this.angleToPlanet) * this.speed;
        this.flyingObject.y -= Math.sin(this.angleToPlanet) * this.speed;
    }
}

export class Alien extends FlyingObject 
{
    constructor()
    {
        super();
        this.speed = 0.8; 
    }

    initflyingObject()
    {
        super.initflyingObject()

        this.flyingObject.beginFill(0xff00ff);
        this.flyingObject.drawCircle(0, 0, this.radius);
        this.flyingObject.endFill();
    }

    checkCollision(projectile) 
    {
        const distX = this.flyingObject.x - projectile.projectile.x;
        const distY = this.flyingObject.y - projectile.projectile.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        return distance < this.radius + projectile.radius;
    }
}

export class Meteorite extends FlyingObject 
{
    constructor()
    {
        super();
        this.speed = 2.3;
    }

    initflyingObject()
    {
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