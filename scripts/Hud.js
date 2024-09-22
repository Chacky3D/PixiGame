import { container, scoreManager, creditManager } from './GameManager.js';

export class HUD
{
    constructor()
    {
        this.onscreenScore = 0;
        this.onscreenCredits = 0;
    }
    
    updateHUD() {
        this.onscreenScore = scoreManager.score;
        this.onscreenCredits = creditManager.credits;
        console.log("Puntaje: ", this.onscreenScore);
        console.log("Créditos: ", this.onscreenCredits);
    }
}