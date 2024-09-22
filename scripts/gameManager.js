import { Alien } from './FlyingObjects.js';
import { Meteorite } from './FlyingObjects.js';
import { Player } from './Player.js';
import { Planet } from './Planet.js';
import { CreditManager } from './CreditManager.js';
import { ScoreManager } from './ScoreManager.js';
import { HUD } from './Hud.js';

export const app = new PIXI.Application();
export const container = new PIXI.Container();
export const projectiles = [];
export let angle = 0;
export const creditManager = new CreditManager();
export const scoreManager = new ScoreManager();
export const hud = new HUD();
const rotationSpeed = 0.05;

app.init({
    width: 1024,
    height: 768,
    backgroundColor: 0x1099bb
}).then(() => {
    document.body.appendChild(app.view);

    initContainer();

    runGame(app);
});

function initContainer()
{
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    app.stage.addChild(container);
}

function runGame(app) {

    const planet = new Planet(container);
    const player = new Player(container);

    // Manejo de teclas
    let rotateClockwise = false;
    let rotateCounterClockwise = false;

    // Intervalo de disparo (ráfaga de balas actual)
    let shootingInterval = null;

    // Objects
    const aliens = [];
    const meteorites = [];

    let frames = 0;

    // Event listeners para teclas
    window.addEventListener('keydown', (e) => 
    {
        const key = e.key.toLowerCase(); // Normaliza la tecla a minúscula
        switch (key) 
        {
            case 'a':
                rotateCounterClockwise = true;
                break;

            case 'd':
                rotateClockwise = true;
                break;

            case ' ':
                if (!shootingInterval) 
                {
                    player.shoot(); // Dispara al presionar espacio
                    shootingInterval = setInterval(player.shoot.bind(player), 333);
                }
                break;

            case 'k': // Para agregar nave adicional (dev)
                player.createNewShip();
                break;

            case 'l': // Para eliminar naves adicionales (dev)
                player.removeSideShips();
                break;
        }
    });
    
    window.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase(); // Normaliza la tecla a minúscula
    
        switch (key) 
        {
            case 'a':
                rotateCounterClockwise = false;
                break;

            case 'd':
                rotateClockwise = false;
                break;
                
            case ' ':
                clearInterval(shootingInterval); // Resetea el intervalo de disparo
                shootingInterval = null;
                break;
        }
    });

     // Loop del juego (el Update)
    app.ticker.add(() => 
    {
        //console.log(`FPS actual: ${app.ticker.FPS}`);

        // Actualizar el ángulo dependiendo de la tecla presionada
        if (rotateCounterClockwise) 
        {
            angle -= rotationSpeed;
        }
        if (rotateClockwise) 
        {
            angle += rotationSpeed;
        }

        player.move(angle);

        projectiles.forEach(p => p.move());

        // Actualizar la posición de los objetos voladores
        aliens.forEach(alien => 
        {
            alien.move();
        });

        meteorites.forEach(meteorite => 
        {
            meteorite.move();
        });
        
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

        //Cada 16s
        if (frames % 960 == 0)
        {
            const meteorite = new Meteorite();
            meteorites.push(meteorite);
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
            }
        }
    }

}
