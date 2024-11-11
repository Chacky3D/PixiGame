import { container, app, scoreManager, creditManager, planet, spliceFlyingObject } from './GameManager.js';
import { Explosion } from './Explosion.js';
import { Planet } from './Planet.js';

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
        this.currentAnimatedSprite.on('pointerdown', () =>this.condicionDeClick() );
    }

    condicionDeClick()
    {
        if( planet.life > 0) {
            spliceFlyingObject(this)
            this.destroy();
        }
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

export class AlienComandante extends Alien {
    constructor(x, y) {
        super(x, y);
        this.cohesionFactor = 0.01;       // Ajusta la magnitud de cada fuerza
        this.alignmentFactor = 0.05;
        this.separationFactor = 0.1;
    }

    applyBoidsBehavior(nearbyAliens) {
        const cohesion = this.cohesion(nearbyAliens);
        const alignment = this.alignment(nearbyAliens);
        const separation = this.separation(nearbyAliens);

        // Aplica las fuerzas calculadas
        this.velocity.x += cohesion.x * this.cohesionFactor + alignment.x * this.alignmentFactor + separation.x * this.separationFactor;
        this.velocity.y += cohesion.y * this.cohesionFactor + alignment.y * this.alignmentFactor + separation.y * this.separationFactor;
    }

    cohesion(nearbyAliens) {
        let averagePosition = { x: 0, y: 0 };
        nearbyAliens.forEach(alien => {
            averagePosition.x += alien.x;
            averagePosition.y += alien.y;
        });

        averagePosition.x /= nearbyAliens.length;
        averagePosition.y /= nearbyAliens.length;

        // Calcula el vector hacia la posición promedio
        return {
            x: (averagePosition.x - this.x),
            y: (averagePosition.y - this.y)
        };
    }

    alignment(nearbyAliens) {
        let averageVelocity = { x: 0, y: 0 };
        nearbyAliens.forEach(alien => {
            averageVelocity.x += alien.velocity.x;
            averageVelocity.y += alien.velocity.y;
        });

        averageVelocity.x /= nearbyAliens.length;
        averageVelocity.y /= nearbyAliens.length;

        return {
            x: averageVelocity.x - this.velocity.x,
            y: averageVelocity.y - this.velocity.y
        };
    }

    separation(nearbyAliens) {
        let separationForce = { x: 0, y: 0 };
        nearbyAliens.forEach(alien => {
            const dx = this.x - alien.x;
            const dy = this.y - alien.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0 && distance < 50) { // Mantén a una distancia de 50
                separationForce.x += dx / distance;
                separationForce.y += dy / distance;
            }
        });

        return separationForce;
    }
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