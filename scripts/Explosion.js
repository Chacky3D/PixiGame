import { container } from "./GameManager.js";

export class Explosion
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.animatedSprites = {};
        this.currentAnimatedSprite;
        this.animationSpeed = 0.2;
        this.spritePath = 'sprites/explosion.json';
        this.spriteWidth = 48;
        this.spriteHeight = 48;
        this.loadSpriteSheet();
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
        animatedSprite.x = this.x;
        animatedSprite.y = this.y;
    }

    //Ejecuta una animación perteneciente a dicionario "animatedSprites".
    play(animationKey)
    {
        this.currentAnimatedSprite = this.animatedSprites[animationKey];
        container.addChild(this.currentAnimatedSprite);
        this.currentAnimatedSprite.play();
        setTimeout(this.destroy.bind(this), 580);
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
    changeAnimationSpeed(speed){
        this.currentAnimatedSprite.animationSpeed = speed;
    }

    destroy()
    {
        container.removeChild(this.currentAnimatedSprite)
    }
}