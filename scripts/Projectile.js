import { container, app, projectiles } from "./GameManager.js";

export class Projectile
{

    constructor(ship, shipAngle)
    {
        this.projectile = new PIXI.Graphics();
        this.speed = 2;
        this.radius = 5;
        this.initProjectile(ship, shipAngle);
    }

    initProjectile(ship, shipAngle)
    {
        this.projectile.beginFill(0xffff00); // Color del proyectil (amarillo)
        this.projectile.drawCircle(0, 0, this.radius); // Tamaño del proyectil
        this.projectile.endFill();

        this.projectile.x = ship.x;
        this.projectile.y = ship.y;
        this.projectile.direction = 
        {
            x: Math.cos(shipAngle),
            y: Math.sin(shipAngle)
        };

        container.addChild(this.projectile);
    }

    move()
    {
        this.projectile.x += this.projectile.direction.x * this.speed;
        this.projectile.y += this.projectile.direction.y * this.speed;

        if (this.projectile.x < -container.x || this.projectile.x > app.screen.width - container.x ||
            this.projectile.y < -container.y || this.projectile.y > app.screen.height - container.y) 
        {
            this.destroy();
        }
    }

    destroy()
    {
        container.removeChild(this.projectile);
            const index = projectiles.indexOf(this);
            if (index > -1) 
            {
                projectiles.splice(index, 1);
            }
    }

}