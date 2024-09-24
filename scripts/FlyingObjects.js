import { container, app, scoreManager, creditManager } from './GameManager.js';

class FlyingObject 
{

    constructor() 
    {
        this.speed;
        this.animatedSprites = {};
        this.currentAnimatedSprite;
        this.animationSpeed;
        this.spritePath ;
        this.spriteWidth;
        this.spriteHeight;
        
    }

    //Carga el spritesheet del objeto basado en el "spritePath".
    async loadSpriteSheet()
    {
        await PIXI.Assets.load(this.spritePath).then(sheet => this.createAnimationsFrom(sheet));
        this.initflyingObject();
        this.setupClickListener();
    }

    //Crea un set de animaciones en base a lo descripto en el "spritePath" e iniciliza la animacion "mooving".
    createAnimationsFrom(sheet)
    {
        this.animatedSprites = 
        {
            'none' : new PIXI.AnimatedSprite(sheet.animations['none']),
            'mooving' : new PIXI.AnimatedSprite(sheet.animations['mooving']),
            'beHarmed' : new PIXI.AnimatedSprite(sheet.animations['beHarmed']),
            'vfx' : new PIXI.AnimatedSprite(sheet.animations['vfx']),
        }

        const animatedSpritesValue = Object.values(this.animatedSprites);
        animatedSpritesValue.forEach(s => this.prepareToBeUsed(s));

        this.play('mooving');
    }

    //Setea los valores correpondientes al tamaño del sprite.
    prepareToBeUsed(animatedSprite)
    {
        animatedSprite.width = this.spriteWidth;
        animatedSprite.height = this.spriteHeight;
        animatedSprite.anchor = (0.5, 0.5);
        animatedSprite.animationSpeed = this.animationSpeed;
    }

    //Ejecuta una animación perteneciente a dicionario "animatedSprites".
    play(animationKey)
    {
        this.currentAnimatedSprite = this.animatedSprites[animationKey];
        container.addChild(this.currentAnimatedSprite);
        this.currentAnimatedSprite.play();
    }

    //Para la animación que se está ejecutando actualmente.
    stop()
    {
        this.currentAnimatedSprite.stop();
    }

    //Cambia la animación actual por la que recibe por parámetro.
    changeAnimation(animationKey)
    {
        container.removeChild(this.currentAnimatedSprite);
        this.currentAnimatedSprite = this.animatedSprites[animationKey];
        container.addChild(this.currentAnimatedSprite);
        this.currentAnimatedSprite.play();
    }

    //Cambia la velocidad de la animación.
    changeAnimationSpeed(speed)
    {
        this.currentAnimatedSprite.animationSpeed = speed;
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
        this.radius = 15;
        this.animationSpeed = 0.5;
        this.spritePath = 'sprites/alien.json';
        this.spriteWidth = 64;
        this.spriteHeight = 32;
        this.loadSpriteSheet();
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
        this.animationSpeed = 0.5;
        this.spritePath = 'sprites/moon.json';
        this.spriteWidth = 50;
        this.spriteHeight = 50;
        this.loadSpriteSheet();
    }
    
    destroy() 
    {
        super.destroy()
        creditManager.addCredits(1);
        scoreManager.addScore(25);
    }
}