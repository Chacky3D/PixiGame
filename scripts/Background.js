import { container, app } from "./GameManager.js";

export class Background
{
    constructor()
    {
        this.initBackground();
    }

    initBackground()
    {
        PIXI.Assets.load('sprites/bg_purple_nebula.png').then((texture) => {
            // Create a sprite from the loaded texture
            const background = new PIXI.Sprite(texture);
            background.zIndex = -1;
        
            // Set the position and size of the background
            background.anchor.set(0.5, 0.5);
            background.width = app.screen.width;
            background.height = app.screen.height;
        
            // Add the background to the stage
            container.addChild(background);
        })
    }
}