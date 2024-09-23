import { player } from "./GameManager.js";

export class GameInput
{
    constructor()
    {
        this.rotateClockwise = false;
        this.rotateCounterClockwise = false;
        this.shootingInterval = null;
        this.listenForEvents();

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
                        if (!this.shootingInterval) 
                        {
                            player.shoot();
                            this.shootingInterval = setInterval(player.shoot.bind(player), 333);
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
                        clearInterval(this.shootingInterval); // Resetea el intervalo de disparo
                        this.shootingInterval = null;
                        break;
                }
            });
    }
    
}