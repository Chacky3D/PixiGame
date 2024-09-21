import { container, angle, projectiles } from './GameManager.js';
import { Projectile } from './Projectile.js';

export class Player
{

    constructor()
    {
        this.pricipalShip;
        this.orbitRadius = 85;
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
            container.addChild(newShip);
        }
    }

    removeSideShips() 
    {
        if(this.ships.length > 1)
        {
            container.removeChild(this.ships[this.ships.length - 1]);
            this.ships.pop();
        }
    }

    move()
    {
        let i = 0;
            this.ships.forEach(s => 
            {
                s.x = Math.cos(angle - this.sideShipOffsetAngle * i) * this.orbitRadius;
                s.y = Math.sin(angle - this.sideShipOffsetAngle * i) * this.orbitRadius;
                s.rotation = angle - this.sideShipOffsetAngle * i + Math.PI / 2;
                i++;
            });
    }

    shoot()
    {
        let i = 0;
        this.ships.forEach(s => 
        {
            projectiles.push(new Projectile(s, angle - this.sideShipOffsetAngle * i));
            i++;
        })
    }

}