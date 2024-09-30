import { app, scoreManager, creditManager, gameInput } from './GameManager.js';

export class HUD
{
    constructor()
    {
        this.onscreenScore = 0;
        this.onscreenCredits = 0;
        this.hold = '';

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

        this.holdText = new PIXI.Text('NO', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'center'
        });
        this.holdText.anchor.set(0.5, 1);
        this.holdText.x = app.screen.width / 2;
        this.holdText.y = app.screen.height - 20;

        this.hudContainer.addChild(this.scoreText);
        this.hudContainer.addChild(this.creditsText);
        this.hudContainer.addChild(this.holdText);
    }

    updateHUD()
    {
        this.onscreenScore = scoreManager.score;
        this.onscreenCredits = creditManager.credits;
        this.hold = gameInput.holdingShoot;

        this.scoreText.text = `Score: ${this.onscreenScore}`;
        this.creditsText.text = `${this.onscreenCredits} Cr.`;
        this.holdText.text = this.hold ? 'HOLD' : '';
    }
}
