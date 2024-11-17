import { container, angle, projectiles, gameIsOver } from './GameManager.js';
import { Projectile } from './Projectile.js';
import { Ship } from './Ship.js';

export class Player
{

    constructor()
    {
        this.pricipalShip;
        this.orbitRadius = 85;
        this.ships = [];
        this.sideShipOffsetAngle = Math.PI / 6;
        this.maxAmountOfShips = 5;
        this.initPlayer();
    }

    initPlayer()
    {
        this.createNewShip();
        this.pricipalShip = this.ships[0];
    }

    async createNewShip()
    {
        if(this.ships.length < this.maxAmountOfShips)
        {
            const newShip = new Ship();
            await newShip.loadSpriteSheet();
            newShip.currentAnimatedSprite.x = Math.cos(0) * this.orbitRadius;
            newShip.currentAnimatedSprite.y = Math.sin(0) * this.orbitRadius;
            newShip.currentAnimatedSprite.rotation = 0 + Math.PI / 2;

            this.ships.push(newShip);
        }
    }

    removeSideShips() 
    {
        if(this.ships.length > 1)
        {
            this.ships[this.ships.length - 1].destroy();
            this.ships.pop();
        }
    }

    move()
    {
        let i = 0;
            this.ships.forEach(s => 
            {
                s.currentAnimatedSprite.x = Math.cos(angle - this.sideShipOffsetAngle * i) * this.orbitRadius;
                s.currentAnimatedSprite.y = Math.sin(angle - this.sideShipOffsetAngle * i) * this.orbitRadius;
                s.currentAnimatedSprite.rotation = angle - this.sideShipOffsetAngle * i + Math.PI / 2;
                i++;
            });
    }

    shoot()
    {
        if (!gameIsOver)
        {
            let i = 0;
            this.ships.forEach(s => 
            {
                projectiles.push(new Projectile(s.currentAnimatedSprite, angle - this.sideShipOffsetAngle * i));
                i++;
            })
        }
    }

}