import { app, scoreManager, player, planet, creditManager, gameInput, framesShootInterval, setFiringRate } from './GameManager.js';

export class HUD
{
    constructor()
    {
        this.onscreenScore = 0;
        this.onscreenCredits = 0;
        this.hold = '';
        this.showBuyShipButton = true;
        this.showBuyFiringRate = true;
        this.fireRates = [20, 17, 15, 13];
        this.minFireRate = this.fireRates[this.fireRates.length - 1]

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

        this.lifeText = new PIXI.Text('Puntaje: 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xF9C22B,
            align: 'left'
        });
        this.lifeText.anchor.set(0.5, 0);
        this.lifeText.x = app.screen.width / 2;
        this.lifeText.y = 20;

        this.creditsText = new PIXI.Text('Créditos: 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xF9C22B,
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
            fill: 0x51ee51,
            align: 'center',
            interactive: true,
            buttonMode: true
        });
        this.buyShipButton.anchor.set(0.5);
        this.buyShipButton.x = app.screen.width / 2;
        this.buyShipButton.y = app.screen.height / 2 - 120;
        this.buyShipButton.interactive = true;
        this.buyShipButton.buttonMode = true;
        this.buyShipButton.on('pointerdown', this.handleBuyShip.bind(this));

        this.buyFiringRateButton = new PIXI.Text('+ Firing Rate => 3 Cr.', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0x51ee51,
            align: 'center',
            interactive: true,
            buttonMode: true
        });
        this.buyFiringRateButton.anchor.set(0.5);
        this.buyFiringRateButton.x = app.screen.width / 2;
        this.buyFiringRateButton.y = app.screen.height / 2 + 120;
        this.buyFiringRateButton.interactive = true;
        this.buyFiringRateButton.buttonMode = true;
        this.buyFiringRateButton.on('pointerdown', this.handleBuyFiringRate.bind(this));


        this.hudContainer.addChild(this.scoreText);
        this.hudContainer.addChild(this.lifeText);
        this.hudContainer.addChild(this.creditsText);
        this.hudContainer.addChild(this.holdText);
        this.hudContainer.addChild(this.buyShipButton);
        this.hudContainer.addChild(this.buyFiringRateButton);


        this.toggleBuyShipButton(false);
        this.toggleBuyFiringRateButton(false);
    }

    toggleBuyShipButton(show)
    {
        this.showBuyShipButton = show;
        this.buyShipButton.visible = show;
    }

    toggleBuyFiringRateButton(show)
    {
        this.showBuyFiringRate = show;
        this.buyFiringRateButton.visible = show;
    }

    handleBuyShip()
    {
        const shipCost = 2;
        if (creditManager.credits >= shipCost) {
            creditManager.addCredits(-shipCost);
            player.createNewShip();
            this.updateHUD();
            this.toggleBuyShipButton(false);
            this.toggleBuyFiringRateButton(false);
            gameInput.setBuyMenuVisible(false);
        } else {
            console.log('No alcanzan créditos para comprar una nave');
        }
    }

    handleBuyFiringRate()
    {
        const firingRateCost = 3;
        if ((creditManager.credits >= firingRateCost) && framesShootInterval > this.minFireRate) {
            creditManager.addCredits(-firingRateCost);
            setFiringRate(this.fireRateIncrement());
            gameInput.setActualFramesStartShooting();
            this.updateHUD();
            this.toggleBuyShipButton(false);
            this.toggleBuyFiringRateButton(false);
            gameInput.setBuyMenuVisible(false);
        } else {
            console.log('No alcanzan créditos para comprar firing rate o rate al mínimo');
        }
    }

    updateHUD()
    {
        this.onscreenScore = scoreManager.score;
        this.onscreenLife = planet.life;
        this.onscreenCredits = creditManager.credits;
        this.hold = gameInput.holdingShoot;

        this.scoreText.text = `Score: ${this.onscreenScore}`;
        this.lifeText.text = `Life: ${this.onscreenLife}`;
        this.creditsText.text = `${this.onscreenCredits} Cr.`;
        this.holdText.text = this.hold ? 'HOLD' : '';
    }

    fireRateIncrement()
    {
        const i = this.fireRates.findIndex(r => framesShootInterval == r);
    
        if (this.fireRates[i] > this.minFireRate) {
            return this.fireRates[i + 1];
        } else {
            return this.fireRates[i];
        }
    }

    gameOver()
    {
        // Crear un contenedor para el Game Over
        const gameOverContainer = new PIXI.Container();
            
        // Crear un rectángulo negro que ocupe toda la pantalla
        const rect = new PIXI.Graphics();
        rect.beginFill(0x030000);
        rect.drawRect(0, 0, app.screen.width, app.screen.height);
        rect.endFill();
            
        // Añadir el rectángulo al contenedor
        gameOverContainer.addChild(rect);
            
            // Configurar el estilo de texto
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: '#ffffff',
            align: 'center'
        });
            
            // Crear el texto "Game Over"
        const gameOverText = new PIXI.Text('GAME OVER', textStyle);
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(app.screen.width / 2, app.screen.height / 4);
            
            // Crear el texto del puntaje
        const scoreText = new PIXI.Text('Puntaje: ' + this.onscreenScore, textStyle);
        scoreText.anchor.set(0.5);
        scoreText.position.set(app.screen.width / 2, app.screen.height / 2);
            
            // Crear el texto "Presione F5 para reiniciar"
        const restartText = new PIXI.Text('Presione F5 para reiniciar', textStyle);
        restartText.anchor.set(0.5);
        restartText.position.set(app.screen.width / 2, (app.screen.height / 4) * 3);
            
            // Añadir los textos al contenedor
        gameOverContainer.addChild(gameOverText);
        gameOverContainer.addChild(scoreText);
        gameOverContainer.addChild(restartText);
            
        // Posicionar el contenedor por encima de todos los sprites
        app.stage.addChild(gameOverContainer);
    }
}
