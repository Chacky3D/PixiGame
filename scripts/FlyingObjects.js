import { container, app, scoreManager, creditManager, planet, spliceFlyingObject, alienVelocityFactor } from './GameManager.js';
import { Explosion } from './Explosion.js';
import { LaserBeam } from './LaseBeam.js';

class FlyingObject 
{

    constructor() 
    {
        this.flyingObjectContainer = new PIXI.Container();
        this.initialSpeed;
        this.speed;
        this.animatedSprites = {};
        this.currentAnimatedSprite;
        this.animationSpeed;
        this.spritePath;
        this.spriteWidth;
        this.spriteHeight;
        this.velocityXAdjustment;
        this.velocityYAdjustment;
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
        this.currentAnimatedSprite.on('pointerdown', (event) => 
            {
                this.condicionDeClick()
                new LaserBeam(event);
            });
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

    aceleration()
    {
        this.speed = this.initialSpeed * alienVelocityFactor;
    }

    move() 
    {
        this.aceleration();
        const velocityX = Math.cos(this.angleToPlanet) * this.speed;
        const velocityY = Math.sin(this.angleToPlanet) * this.speed;

        
        this.flyingObjectContainer.x -= velocityX;
        this.flyingObjectContainer.y -= velocityY;
    }

    calculateDistance(flyingObjectContainer, projectile = null)
    {
        const distanceX = projectile != null ? flyingObjectContainer.x - projectile.projectile.x : flyingObjectContainer.x;
        const distanceY = projectile != null ? flyingObjectContainer.y - projectile.projectile.y : flyingObjectContainer.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        return distance;
    }

    calculateAlienDistance(alien1, alien2)
    {
        const distanceX = alien1.flyingObjectContainer.x - alien2.flyingObjectContainer.x;
        const distanceY = alien1.flyingObjectContainer.y - alien2.flyingObjectContainer.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        return distance;
    }
}

export class Alien extends FlyingObject 
{
    constructor(path = null)
    {
        super();
        this.initialSpeed = 0.8;
        this.speed = 0.8;
        this.radius = 15;
        this.animationSpeed = 0.3;
        this.spritePath = path == null ? 'sprites/normal_ship.json' : path;
        this.spriteWidth = 48;
        this.spriteHeight = 48;
        this.loadSpriteSheet();
        this.separationDistance = 40;
        this.separationForce = 1;
        this.comandanteForceAtenuation = 50;
    }

    applySeparation(neighbors)
    {
        neighbors.forEach(neighbor => {
            if (neighbor !== this) {
                const distance = this.calculateAlienDistance(this, neighbor);
                if (distance < this.separationDistance) {
                    // Calcula la dirección de la fuerza de separación
                    const separationX = this.flyingObjectContainer.x - neighbor.flyingObjectContainer.x;
                    const separationY = this.flyingObjectContainer.y - neighbor.flyingObjectContainer.y;
                    const length = Math.sqrt(separationX ** 2 + separationY ** 2);
                    // Aplica la fuerza de separación
                    this.flyingObjectContainer.x += (separationX / length) * this.separationForce;
                    this.flyingObjectContainer.y += (separationY / length) * this.separationForce;
                }
            }
        });
    }

    applyComandanteForce(reunionPoint)
    {
        const relativeVector = {x: this.flyingObjectContainer.x - reunionPoint.x, y: this.flyingObjectContainer.y - reunionPoint.y}
        this.flyingObjectContainer.x -= relativeVector.x / this.comandanteForceAtenuation;
        this.flyingObjectContainer.y -= relativeVector.y / this.comandanteForceAtenuation;
    }

    destroy() 
    {
        super.destroy()
        scoreManager.addScore(10);
    }

    destroyByPlanet()
    {
        super.destroy();
    }

    checkCollision(projectile) 
    {   
        if (!projectile.isLoaded) return false;

        const distance = this.calculateDistance(this.flyingObjectContainer, projectile);

        return distance < this.radius + projectile.radius;
    }

    checkProximityAndTeleport(projectile){}
}

export class AlienComandante extends Alien {
    constructor() {
        super('sprites/commander_ship.json');;
        this.effectDistance = 200;
        this.targetDistanceOffset = 60;
        this.maxObedientAliens = 2;
    }

    applyComandanteBehavior(nearbyAliens) {
        const distanceToOrigin = Math.sqrt(this.flyingObjectContainer.x ** 2 + this.flyingObjectContainer.y ** 2);
        const targetDistance = distanceToOrigin - this.targetDistanceOffset;
        const unitVector = {x: this.flyingObjectContainer.x / distanceToOrigin, y: this.flyingObjectContainer.y / distanceToOrigin};
        const reunionPoint = {x: unitVector.x * targetDistance, y: unitVector.y * targetDistance};

        const obedientAliens = nearbyAliens
            .filter(alien => !(alien instanceof AlienComandante || alien instanceof TeleportingAlien)) // Excluir comandantes y teleporting
            .filter(alien => this.calculateAlienDistance(this, alien) < this.effectDistance) // Excluir los q están mas lejos de la distancia de efecto
            .sort((a, b) => this.calculateAlienDistance(this, a) - this.calculateAlienDistance(this, b)) // Ordenar por distancia
            .slice(0, this.maxObedientAliens); // Reducir lista a maxObedientAliens

        obedientAliens.forEach(alien => {alien.applyComandanteForce(reunionPoint);})
    }

    applySeparation(neighbors) {}

    condicionDeClick() {}

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

        const distance = this.calculateDistance(this.flyingObjectContainer, projectile);

        if (distance < this.proyectileDistanceThreshold) 
        {
            this.teleport();
        }
    }

    // Método para cambiar de ángulo (manteniendo la distancia radial)
    teleport() 
    {
        const currentDistanceToPlanet = this.calculateDistance(this.flyingObjectContainer);

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

    aceleration(){}
    
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