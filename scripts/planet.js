import { container } from './GameManager.js';

export class Planet
{
    constructor()
    {
        this.animatedSprites = {};
        this.currentAnimatedSprite;
        this.animationSpeed = 0.2;
        this.spritePath = 'sprites/star.json';
        this.spriteWidth = 128;
        this.spriteHeight = 128;
        this.life = 10;
        this.loadSpriteSheet();
        this.radius = 50;
    }

    //Carga el spritesheet del objeto basado en el "spritePath".
    async loadSpriteSheet()
    {
        await PIXI.Assets.load(this.spritePath).then(sheet => this.initAnimationsLoad(sheet));
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

    
    changeAnimationSpeed(speed){
    //Cambia la velocidad de la animación.
        this.currentAnimatedSprite.animationSpeed = speed;
    }

    destroy(){
    //Elimina el planeta.
        container.removeChild(this.currentAnimatedSprite);
    }

    takeDamage(){
    //Resta vida del planeta y lo destruye si llega la vida a 0.
        if (this.life > 0)
        {
            this.life -= 1;
        }
        if (this.life <= 0) 
        { 
            this.destroy();
        } 
    }

    checkCollision(alien) 
    {   
        //if (!projectile.isLoaded) return false;

        const distX = 0 - alien.flyingObjectContainer.x;
        const distY = 0 - alien.flyingObjectContainer.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        return distance < this.radius + alien.radius;
    }






}