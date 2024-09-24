import { app, container } from './GameManager.js';

export class Animatable {

    constructor() 
    {
        this.animatedSprites = {};
        this.currentAnimatedSprite;
        this.animationSpeed;
        this.spritePath;
        this.spriteWidth;
        this.spriteHeight;
    }

    async loadSpriteSheet()
    {
        await PIXI.Assets.load(this.spritePath).then(sheet => this.initAnimationsLoad(sheet));
    }

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

    prepareToBeUsed(animatedSprite)
    {
        animatedSprite.width = this.spriteWidth;
        animatedSprite.height = this.spriteHeight;
        animatedSprite.anchor = (0.5, 0.5);
        animatedSprite.animationSpeed = this.animationSpeed;
    }

    play(animationKey)
    {
        this.currentAnimatedSprite = this.animatedSprites[animationKey];
        container.addChild(this.currentAnimatedSprite);
        this.currentAnimatedSprite.play();
    }

    stop()
    {
        this.currentAnimatedSprite.stop();
    }

    changeAnimation(animationKey)
    {
        container.removeChild(this.currentAnimatedSprite);
        this.currentAnimatedSprite = this.animatedSprites[animationKey];
        container.addChild(this.currentAnimatedSprite);
        this.currentAnimatedSprite.play();
    }

    changeAnimationSpeed(speed)
    {
        this.currentAnimatedSprite.animationSpeed = speed;
    }

}