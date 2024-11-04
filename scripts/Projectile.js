import { container, app, projectiles } from "./GameManager.js";

export class Projectile
{

    constructor(ship, shipAngle)
    {
        //this.projectile = new PIXI.Graphics();
        this.speed = 2;
        this.radius = 5;
        this.ship = ship;
        this.shipAngle = shipAngle;
        this.projectile;
        this.animationSpeed = 0.3;
        this.spritePath = 'sprites/projectile.json';
        this.spriteWidth = 16;
        this.spriteHeight = 16;
        this.isLoaded = false;
        this.loadSpriteSheet();
    }

    //Carga el spritesheet del objeto basado en el "spritePath".
    async loadSpriteSheet()
    {
        await PIXI.Assets.load(this.spritePath).then(sheet => this.initAnimationsLoad(sheet));
        this.initProjectile(this.ship, this.shipAngle);
        this.isLoaded = true;
    }

    //Crea un set de animaciones en base a lo descripto en el "spritePath" e iniciliza la animacion "mooving".
    initAnimationsLoad(sheet)
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
        this.projectile = this.animatedSprites[animationKey];
        container.addChild(this.projectile);
        this.projectile.play();
    }

    //Para la animación que se está ejecutando actualmente.
    stop()
    {
        this.projectile.stop();
    }

    //Cambia la animación actual por la que recibe por parámetro.
    changeAnimation(animationKey)
    {
        container.removeChild(this.projectile);
        this.projectile = this.animatedSprites[animationKey];
        container.addChild(this.projectile);
        this.projectile.play();
    }

    
    changeAnimationSpeed(speed){
    //Cambia la velocidad de la animación.
        this.projectile.animationSpeed = speed;
    }

    initProjectile(ship, shipAngle)
    {
        /*this.projectile.beginFill(0xffff00); // Color del proyectil (amarillo)
        this.projectile.drawCircle(0, 0, this.radius); // Tamaño del proyectil
        this.projectile.endFill();*/

        this.projectile.x = ship.x;
        this.projectile.y = ship.y;
        this.projectile.direction = 
        {
            x: Math.cos(shipAngle),
            y: Math.sin(shipAngle)
        };
        this.projectile.rotation = ship.rotation;

        container.addChild(this.projectile);
    }

    move()
    {
        if(this.isLoaded)
        {
            this.projectile.x += this.projectile.direction.x * this.speed;
            this.projectile.y += this.projectile.direction.y * this.speed;

            if (this.projectile.x < -container.x || this.projectile.x > app.screen.width - container.x ||
                this.projectile.y < -container.y || this.projectile.y > app.screen.height - container.y) 
            {
                this.destroy();
            }
        }
    }

    destroy()
    {
        container.removeChild(this.projectile);
            const index = projectiles.indexOf(this);
            if (index > -1) 
            {
                projectiles.splice(index, 1);
            }
    }

}