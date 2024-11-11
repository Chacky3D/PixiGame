import { container, app, scoreManager, creditManager } from './GameManager.js';
import { Explosion } from './Explosion.js';

class FlyingObject 
{

    constructor() 
    {
        this.flyingObjectContainer = new PIXI.Container(); 
        this.speed;
        this.animatedSprites = {};
        this.currentAnimatedSprite;
        this.animationSpeed;
        this.spritePath;
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
        this.flyingObjectContainer.addChild(this.currentAnimatedSprite);
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
        this.flyingObjectContainer.removeChild(this.currentAnimatedSprite);
        this.currentAnimatedSprite = this.animatedSprites[animationKey];
        this.flyingObjectContainer.addChild(this.currentAnimatedSprite);
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

        this.flyingObjectContainer.x = Math.cos(this.angleToPlanet) * spawnDistance;
        this.flyingObjectContainer.y = Math.sin(this.angleToPlanet) * spawnDistance;

        container.addChild(this.flyingObjectContainer);
    }

    setupClickListener() 
    {
        this.currentAnimatedSprite.on('pointerdown', () => this.destroy());
    }

    destroy() 
    {
        new Explosion(this.flyingObjectContainer.x, this.flyingObjectContainer.y);
        container.removeChild(this.flyingObjectContainer);
    }

    move() 
    {
        this.flyingObjectContainer.x -= Math.cos(this.angleToPlanet) * this.speed;
        this.flyingObjectContainer.y -= Math.sin(this.angleToPlanet) * this.speed;
    }
}

export class Alien extends FlyingObject 
{
    constructor(path = null)
    {
        super();
        this.speed = 0.8;
        this.radius = 15;
        this.animationSpeed = 0.3;
        this.spritePath = path == null ? 'sprites/normal_ship.json' : path;
        this.spriteWidth = 48;
        this.spriteHeight = 48;
        this.loadSpriteSheet();
    }

    destroy() 
    {
        super.destroy()
        scoreManager.addScore(10);
    }

    checkCollision(projectile) 
    {   
        if (!projectile.isLoaded) return false;

        const distX = this.flyingObjectContainer.x - projectile.projectile.x;
        const distY = this.flyingObjectContainer.y - projectile.projectile.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        return distance < this.radius + projectile.radius;
    }

    checkProximityAndTeleport(projectile){}
}

export class TeleportingAlien extends Alien 
{
    constructor() 
    {
        super('sprites/doge_ship.json');
        this.proyectileDistanceThreshold = 50;
    }

    checkCollision(projectile) {return false;}

    checkProximityAndTeleport(projectile)
    {
        if (!projectile.isLoaded) return false;

        const distX = this.flyingObjectContainer.x - projectile.projectile.x;
        const distY = this.flyingObjectContainer.y - projectile.projectile.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < this.proyectileDistanceThreshold) 
        {
            this.teleport();
        }
    }

    // Método para cambiar de ángulo (manteniendo la distancia radial)
    teleport() 
    {
    const dx = this.flyingObjectContainer.x;
    const dy = this.flyingObjectContainer.y;
    const currentDistanceToPlanet = Math.sqrt(dx * dx + dy * dy);

    const angleOffset = (Math.random() - 0.5) * Math.PI; // Cambia a un ángulo aleatorio
    this.angleToPlanet += angleOffset;

    this.flyingObjectContainer.x = Math.cos(this.angleToPlanet) * currentDistanceToPlanet;
    this.flyingObjectContainer.y = Math.sin(this.angleToPlanet) * currentDistanceToPlanet;
    }
}

export class Meteorite extends FlyingObject 
{
    constructor()
    {
        super();
        this.speed = 2.3;
        this.animationSpeed = 0.3;
        this.spritePath = 'sprites/asteroid.json';
        this.spriteWidth = 48;
        this.spriteHeight = 48;
        this.loadSpriteSheet();
    }
    
    destroy() 
    {
        container.removeChild(this.flyingObjectContainer);
        creditManager.addCredits(1);
        scoreManager.addScore(25);
    }

    initflyingObject() 
    {
        super.initflyingObject()

        // Agregar unos grados random para que no vaya hacia el planeta (de -0.6 a -0.13 o de 0.13 a 0.6)
        let randAngleIncrement = (Math.random() * (0.6 - 0.13)) + 0.13;
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        this.angleToPlanet += randAngleIncrement * plusOrMinus;
    }
}