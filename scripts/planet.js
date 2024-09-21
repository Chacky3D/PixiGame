import { container } from './GameManager.js';

export class Planet
{
    constructor()
    {
        this.planet = new PIXI.Graphics();
        this.planetRadius = 50;
        this.initPlanet();
    }

    initPlanet()
    {
        this.planet.beginFill(0x00ff00);
        this.planet.drawCircle(0, 0, this.planetRadius);
        this.planet.endFill();
        container.addChild(this.planet);
    }
}