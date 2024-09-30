import { player } from "./GameManager.js";
import { frames } from "./GameManager.js";

export class GameInput
{
    constructor()
    {
        this.rotateClockwise = false;
        this.rotateCounterClockwise = false;
        this.listenForEvents();
        this.shooting = false;
        this.holdingShoot = false;
        this.actualFramesStartShooting = 0;

    }

    listenForEvents()
    {
        window.addEventListener('keydown', (e) => 
            {
                const key = e.key.toLowerCase();
                switch (key) 
                {
                    case 'a':
                        this.rotateCounterClockwise = true;
                        break;
        
                    case 'd':
                        this.rotateClockwise = true;
                        break;
        
                    case ' ':
                        if (!this.shooting) 
                        {
                            player.shoot();
                            this.actualFramesStartShooting = frames;
                            this.shooting = true;
                            this.holdingShoot = false;
                        }
                        break;
                    
                    case 'shift':
                        {
                            this.holdingShoot = !this.holdingShoot;
                        }
                        if (!this.shooting)
                        {
                            this.actualFramesStartShooting = frames;
                        }
                        break;
        
                    case 'k':
                        player.createNewShip();
                        break;
        
                    case 'l':
                        player.removeSideShips();
                        break;
                }
            });
            
            window.addEventListener('keyup', (e) => {
                const key = e.key.toLowerCase();
            
                switch (key) 
                {
                    case 'a':
                        this.rotateCounterClockwise = false;
                        break;
        
                    case 'd':
                        this.rotateClockwise = false;
                        break;
                        
                    case ' ':
                        this.shooting = false;
                        break;
                }
            });
            /*
            document.addEventListener("visibilitychange", () => {
                if (document.hidden)
                {
                    clearInterval(this.shootingInterval);
                    this.shootingInterval = null;
                    console.log("something");
                }
            });*/
    }
    
}