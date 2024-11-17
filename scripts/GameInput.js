import { player, hud, frames, creditManager, gameIsOver } from "./GameManager.js";

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
        this.buyMenuVisible = false;

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
                            this.setActualFramesStartShooting();
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
                            this.setActualFramesStartShooting();
                        }
                        break;
        
                    case 'control':
                        if(!gameIsOver)
                        {
                            this.buyMenuVisible = !this.buyMenuVisible;
                            hud.toggleBuyShipButton(this.buyMenuVisible);
                            hud.toggleBuyFiringRateButton(this.buyMenuVisible);
                        }
                        else
                        {
                            hud.toggleBuyShipButton(false);
                            hud.toggleBuyFiringRateButton(false);
                        }
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
    }
    
    setActualFramesStartShooting()
    {
        this.actualFramesStartShooting = frames;
    }

    setBuyMenuVisible(value)
    {
        this.buyMenuVisible = value;
    }
}