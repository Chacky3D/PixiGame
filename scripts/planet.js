export class Planet
{
    constructor(container)
    {
        this.planet = new PIXI.Graphics();
        this.container = container;
        this.planetRadius = 50;
        this.initPlanet();
    }

    initPlanet()
    {
        this.planet.beginFill(0x00ff00);
        this.planet.drawCircle(0, 0, this.planetRadius);
        this.planet.endFill();
        this.container.addChild(this.planet);
    }
}