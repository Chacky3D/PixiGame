export class Player
{
    constructor(container)
    {
        this.pricipalShip;
        this.orbitRadius = 85;
        this.container = container;
        this.ships = [];
        this.sideShipOffsetAngle = Math.PI / 6;
        this.maxAmountOfShips = 12;
        this.initPlayer();
    }

    initPlayer()
    {
        this.createNewShip();
        this.pricipalShip = this.ships[0];
    }

    createNewShip()
    {
        if(this.ships.length < this.maxAmountOfShips)
        {
            const newShip = new PIXI.Graphics();
            newShip.beginFill(0x0000ff);
            newShip.drawRect(-10, -5, 20, 10);
            newShip.endFill();
            newShip.x = Math.cos(0) * this.orbitRadius;
            newShip.y = Math.sin(0) * this.orbitRadius;
            newShip.rotation = 0 + Math.PI / 2;

            this.ships.push(newShip);
            this.container.addChild(newShip);
            }
    }

    removeSideShips() {
        if(this.ships.length > 1)
        {
            this.container.removeChild(this.ships[this.ships.length - 1]);
            this.ships.pop();
        }
    }

    move(angle)
    {
        let i = 0;
            this.ships.forEach(s => 
            {
                s.x = Math.cos(angle - this.sideShipOffsetAngle * i) * this.orbitRadius;
                s.y = Math.sin(angle - this.sideShipOffsetAngle * i) * this.orbitRadius;
                s.rotation = angle - this.sideShipOffsetAngle * i + Math.PI / 2;
                i++;
            }
            );
    }

}