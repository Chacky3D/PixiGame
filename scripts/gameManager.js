import { Alien } from './FlyingObjects.js';
import { Meteorite } from './FlyingObjects.js';
import { Player } from './Player.js';
import { Planet } from './Planet.js';

const app = new PIXI.Application();

app.init({
    width: 1024,
    height: 768,
    backgroundColor: 0x1099bb
}).then(() => {
    document.body.appendChild(app.view);

    runGame(app);
});

function runGame(app) {
    
    // Contenedor para todos los objetos con posición
    const container = new PIXI.Container();
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    app.stage.addChild(container);

    const planet = new Planet(container);
    const player = new Player(container);

    let angle = 0;
    const rotationSpeed = 0.05;

    // Desfase angular para las naves laterales
    //const sideShipOffsetAngle = Math.PI / 11; // Dividido 11. Subiendo ese nro, quedan mas cerca

    // Manejo de teclas. O sea, para q lado rota
    let rotateClockwise = false;
    let rotateCounterClockwise = false;

    // Intervalo de disparo (ráfaga de balas actual)
    let shootingInterval = null;

    // Proyectiles
    const projectiles = [];
    const projectileSpeed = 2;  // Vel de los proyectiles
    const proyectileRadius = 5;

    // Aliens
    const aliens = [];
    const alienSpeed = 0.8;  // Vel con la que los aliens se acercan al planeta

    const meteorites = [];
    const meteoriteSpeed = 2.3; // Vel con la que los meteoritos se desplazan

    let frames = 0;

    // Event listeners para teclas
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase(); // Normaliza la tecla a minúscula
    
        switch (key) {
            case 'a':
                rotateCounterClockwise = true;
                break;
            case 'd':
                rotateClockwise = true;
                break;
            case ' ':
                if (!shootingInterval) {
                    shootFromAllShips(); // Dispara al presionar espacio
                    shootingInterval = setInterval(shootFromAllShips, 333);
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
    
        switch (key) {
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
    app.ticker.add(() => {
        //console.log(`FPS actual: ${app.ticker.FPS}`);

        // Actualizar el ángulo dependiendo de la tecla presionada
        if (rotateCounterClockwise) {
            angle -= rotationSpeed;
        }
        if (rotateClockwise) {
            angle += rotationSpeed;
        }

        // Posicionar la nave en la órbita
        player.move(angle);

        // Actualizar la posición de las naves laterales
        //player.updateSideShipsPosition(angle);

        updateProjectiles();

        // Actualizar la posición de los objetos voladores
        aliens.forEach(alien => {
            alien.move();
        });

        meteorites.forEach(meteorite => {
            meteorite.move();
        });
        
        frames += 1;
        
        if (frames % 2 == 0){
            checkCollisions();
        }
        
        // Invocar Aliens y meteoritos
        //Cada 1s
        if (frames % 60 == 0){
            const alien = new Alien(container, app, alienSpeed);
            aliens.push(alien);
        }

        //Cada 16s
        if (frames % 960 == 0){
            const meteorite = new Meteorite(container, app, meteoriteSpeed);
            meteorites.push(meteorite);
        }

    });

    function shootFromAllShips() {
        //shootProjectile(player.principalShip, angle);
        let i = 0;
        player.ships.forEach(s => 
        {
            shootProjectile(s, angle - player.sideShipOffsetAngle * i)
            i++;
        }
        );
        /*if (player.sideShipsAdded) {
            shootProjectile(player.leftShip, angle - player.sideShipOffsetAngle);
            shootProjectile(player.rightShip, angle + player.sideShipOffsetAngle);
        }*/
    }

    function shootProjectile(ship, shipAngle) {        
        const projectile = new PIXI.Graphics();
        projectile.beginFill(0xffff00); // Color del proyectil (amarillo)
        projectile.drawCircle(0, 0, proyectileRadius); // Tamaño del proyectil
        projectile.endFill();

        projectile.x = ship.x;
        projectile.y = ship.y;

        projectile.direction = {
            x: Math.cos(shipAngle),
            y: Math.sin(shipAngle)
        };

        // Añadir el proyectil al contenedor y a la lista de proyectiles
        container.addChild(projectile);
        projectiles.push(projectile);
    }

    function updateProjectiles() {
        // Actualizar la posición de los proyectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];

            // Mover el proyectil en su dirección
            projectile.x += projectile.direction.x * projectileSpeed;
            projectile.y += projectile.direction.y * projectileSpeed;

            // Si el proyectil sale de los límites de la pantalla, eliminarlo
            if (projectile.x < -container.x || projectile.x > app.screen.width - container.x ||
                projectile.y < -container.y || projectile.y > app.screen.height - container.y) {
                container.removeChild(projectile);
                projectiles.splice(i, 1); // Eliminar el proyectil del array
            }
        }
    }

    function checkCollisions() {
        for (let i = aliens.length - 1; i >= 0; i--) {
            const alien = aliens[i];
            for (let j = projectiles.length - 1; j >= 0; j--) {
                const projectile = projectiles[j];

                if (alien.checkCollision(projectile)) {
                    container.removeChild(projectile);
                    projectiles.splice(j, 1);
                    alien.destroy();
                    aliens.splice(i, 1);
                    break;
                }
            }
        }
    }

}
