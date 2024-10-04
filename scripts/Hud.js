import { app, scoreManager, player, creditManager, gameInput } from './GameManager.js';

export class HUD
{
    constructor()
    {
        this.onscreenScore = 0;
        this.onscreenCredits = 0;
        this.hold = '';
        this.showBuyButton = true;

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

        this.buyShipButton = new PIXI.Text('Nave +1 => 2 Cr.', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0x00ff00,
            align: 'center',
            interactive: true,
            buttonMode: true
        });
        this.buyShipButton.anchor.set(0.5);
        this.buyShipButton.x = app.screen.width / 2;
        this.buyShipButton.y = app.screen.height / 2 - 80;
        this.buyShipButton.interactive = true;
        this.buyShipButton.buttonMode = true;
        this.buyShipButton.on('pointerdown', this.handleBuyShip.bind(this));


        this.hudContainer.addChild(this.scoreText);
        this.hudContainer.addChild(this.creditsText);
        this.hudContainer.addChild(this.holdText);
        this.hudContainer.addChild(this.buyShipButton);

        this.toggleBuyShipButton(false);
    }

    toggleBuyShipButton(show)
    {
        this.showBuyButton = show;
        this.buyShipButton.visible = show;
    }

    handleBuyShip()
    {
        const shipCost = 2;
        if (creditManager.credits >= shipCost) {
            creditManager.credits -= shipCost;
            player.createNewShip();
            this.updateHUD();
            this.toggleBuyShipButton(false);
            gameInput.buyMenuVisible = false;
        } else {
            console.log('No alcanzan créditos para comprar una nave');
        }
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
