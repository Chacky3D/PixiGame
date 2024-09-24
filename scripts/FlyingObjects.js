import { container, app, scoreManager, creditManager } from './GameManager.js';
import { Animatable } from './Animatable.js';

class FlyingObject extends Animatable
{

    constructor() 
    {
        super();

        this.speed;

        this.animationSpeed = 0.8;
        this.spritePath = 'sprites/alien.json'
        this.spriteWidth = 50;
        this.spriteHeight = 30;
        this.radius = 15;

        this.loadSpriteSheet();
    }

    async loadSpriteSheet()
    {
        await super.loadSpriteSheet();
        this.initflyingObject();
        this.setupClickListener();
    }

    initflyingObject() 
    {
        this.currentAnimatedSprite.interactive = true;

        this.angleToPlanet = Math.random() * Math.PI * 2;
        const spawnDistance = Math.max(app.screen.width, app.screen.height) / 2 + 100;

        this.currentAnimatedSprite.x = Math.cos(this.angleToPlanet) * spawnDistance;
        this.currentAnimatedSprite.y = Math.sin(this.angleToPlanet) * spawnDistance;

        container.addChild(this.currentAnimatedSprite);
    }

    setupClickListener() 
    {
        this.currentAnimatedSprite.on('pointerdown', () => this.destroy());
    }

    destroy() 
    {
        container.removeChild(this.currentAnimatedSprite);
    }

    move() 
    {
        this.currentAnimatedSprite.x -= Math.cos(this.angleToPlanet) * this.speed;
        this.currentAnimatedSprite.y -= Math.sin(this.angleToPlanet) * this.speed;
    }
}

export class Alien extends FlyingObject 
{
    constructor()
    {
        super();
        this.speed = 0.8;
    }

    destroy() 
    {
        super.destroy()
        scoreManager.addScore(10);
    }

    checkCollision(projectile) 
    {
        const distX = this.currentAnimatedSprite.x - projectile.projectile.x;
        const distY = this.currentAnimatedSprite.y - projectile.projectile.y;
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
    
    destroy() 
    {
        super.destroy()
        creditManager.addCredits(1);
        scoreManager.addScore(25);
    }
}