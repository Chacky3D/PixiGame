import { app, scoreManager, creditManager } from './GameManager.js';

export class HUD
{
    constructor()
    {
        this.onscreenScore = 0;
        this.onscreenCredits = 0;

        // Contenedor para el HUD:
        this.hudContainer = new PIXI.Container();
        app.stage.addChild(this.hudContainer);

        this.scoreText = new PIXI.Text('Puntaje: 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'left'
        });
        this.scoreText.anchor.set(0, 0);
        this.scoreText.x = 20;
        this.scoreText.y = 20;

        this.creditsText = new PIXI.Text('Créditos: 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'right'
        });
        this.creditsText.anchor.set(1, 0);
        this.creditsText.x = app.screen.width - 20;
        this.creditsText.y = 20;

        this.hudContainer.addChild(this.scoreText);
        this.hudContainer.addChild(this.creditsText);
    }

    updateHUD()
    {
        this.onscreenScore = scoreManager.score;
        this.onscreenCredits = creditManager.credits;

        this.scoreText.text = `Score: ${this.onscreenScore}`;
        this.creditsText.text = `${this.onscreenCredits} Cr.`;
    }
}
