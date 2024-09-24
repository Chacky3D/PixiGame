import { container } from './GameManager.js';
import { Animatable } from './Animatable.js';

export class Planet extends Animatable
{
    constructor()
    {
        super();
        this.animationSpeed = 0.5;
        this.spritePath = 'sprites/moon.json'
        this.spriteWidth = 100;
        this.spriteHeight = 100;
        this.loadSpriteSheet();
    }

    async loadSpriteSheet()
    {
        await super.loadSpriteSheet();
        //console.log(this.currentAnimatedSprite);
    }
}