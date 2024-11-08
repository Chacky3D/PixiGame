import { Alien } from './FlyingObjects.js';
import { TeleportingAlien } from './FlyingObjects.js';
import { Meteorite } from './FlyingObjects.js';
import { Player } from './Player.js';
import { Planet } from './Planet.js';
import { CreditManager } from './CreditManager.js';
import { ScoreManager } from './ScoreManager.js';
import { HUD } from './Hud.js';
import { GameInput } from './GameInput.js';
import { Background } from './Background.js';

export const app = new PIXI.Application();
export const container = new PIXI.Container();
export const projectiles = [];
export const player = new Player();
export const planet = new Planet();
export const creditManager = new CreditManager();
export const scoreManager = new ScoreManager();
export let hud;

export let angle = 0;

export const gameInput = new GameInput();
const background = new Background();
const aliens = [];
const meteorites = [];
const rotationSpeed = 0.05;

export let frames = 0;
export let framesShootInterval = 20;

app.init({
    width: 1024,
    height: 768,
    backgroundColor: 0x1099bb
}).then(() => {
    document.body.appendChild(app.view);

    initContainer();
    hud = new HUD();
    runGame(app);
});

function initContainer()
{
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    app.stage.addChild(container);
}

function runGame(app) {

     // Loop del juego (el Update)
    app.ticker.add(() => 
    {
        //console.log(`FPS actual: ${app.ticker.FPS}`);
        
        // Actualizar el ángulo dependiendo de la tecla presionada
        if (gameInput.rotateCounterClockwise) 
        {
            angle -= rotationSpeed;
        }
        if (gameInput.rotateClockwise) 
        {
            angle += rotationSpeed;
        }

        //Mover las entidades del juego.
        player.move();
        projectiles.forEach(projectile => projectile.move());
        aliens.forEach(alien => alien.move());
        meteorites.forEach(meteorite => meteorite.move());
        
        frames += 1;
        
        if (frames % 2 == 0)
        {
            checkCollisions();
        }

        if (frames % 8 == 0)
        {
            hud.updateHUD();
        }

        // Invocar Aliens y meteoritos
        //Cada 1s
        if (frames % 60 == 0)
        {
            const alien = new Alien();
            aliens.push(alien);
        }

        //Cada 10s
        if (frames % 600 == 0)
        {
            const alien = new TeleportingAlien();
            aliens.push(alien);
        }

        //Cada 16s
        if (frames % 960 == 0)
        {
            const meteorite = new Meteorite();
            meteorites.push(meteorite);
        }

        if ((frames - gameInput.actualFramesStartShooting) % framesShootInterval == 0 && (gameInput.shooting || gameInput.holdingShoot)){
            player.shoot();
        }

    });

    function checkCollisions() 
    {
        for (let i = aliens.length - 1; i >= 0; i--) 
        {
            const alien = aliens[i];
            for (let j = projectiles.length - 1; j >= 0; j--) 
            {
                const projectile = projectiles[j];
                if (alien.checkCollision(projectile)) 
                {
                    projectile.destroy();
                    alien.destroy();
                    aliens.splice(i, 1);
                    break;
                }
                alien.checkProximityAndTeleport(projectile);
            }
        }
    }
}

export function setFiringRate(value)
{
    framesShootInterval = value;
}