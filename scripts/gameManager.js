import { Alien } from './FlyingObjects.js';
import { Meteorite } from './FlyingObjects.js';
import { Player } from './player.js';
import { Planet } from './planet.js';

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

    // Aliens
    const aliens = [];
    const alienSpeed = 0.8;  // Vel con la que los aliens se acercan al planeta

    const meteorites = [];
    const meteoriteSpeed = 1.7; // Vel con la que los meteoritos se desplazan

    // Event listeners para teclas
    window.addEventListener('keydown', (e) => {
        if (e.key === 'a' || e.key === 'A') {
            rotateCounterClockwise = true;
        }
        if (e.key === 'd' || e.key === 'D') {
            rotateClockwise = true;
        }
        if (e.key === ' ') { // Si se presiona espacio
            if (!shootingInterval) {
                shootFromAllShips(); //Para q tire uno apenas apretás el botón
                shootingInterval = setInterval(() => {
                    shootFromAllShips()
                }, 333);
            }
        }

        // Agregar y quitar naves adicionales (dev, eliminar cdo esté la UI de compra de naves)
        if (e.key === 'k' || e.key === 'K') {
            player.createNewShip();
        }
        if (e.key === 'l' || e.key === 'L') {
            player.removeSideShips();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'a' || e.key === 'A') {
            rotateCounterClockwise = false;
        }
        if (e.key === 'd' || e.key === 'D') {
            rotateClockwise = false;
        }
        if (e.key === ' ') {
            // Resetear tiempo de disparo
            clearInterval(shootingInterval);
            shootingInterval = null;
        }
    });

    // Loop del juego (el Update)
    app.ticker.add(() => {
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

        checkCollisions();
    });

    function shootFromAllShips() {
        //shootProjectile(player.principalShip, angle);
        player.ships.forEach(s => 
            shootProjectile(s, s.rotation)
        );
        /*if (player.sideShipsAdded) {
            shootProjectile(player.leftShip, angle - player.sideShipOffsetAngle);
            shootProjectile(player.rightShip, angle + player.sideShipOffsetAngle);
        }*/
    }

    function shootProjectile(ship, shipAngle) {
        const projectile = new PIXI.Graphics();
        projectile.beginFill(0xffff00); // Color del proyectil (amarillo)
        projectile.drawCircle(0, 0, 5); // Tamaño del proyectil
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

    // Generar aliens cada cierto tiempo
    setInterval(() => {
        const alien = new Alien(container, app, alienSpeed);
        aliens.push(alien);
    }, 1000);

    setInterval(() => {
        const meteorite = new Meteorite(container, app, meteoriteSpeed);
        meteorites.push(meteorite);
    }, 1000);

}
