import { Alien } from './Alien.js';

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
    app.stage.addChild(container);

    // Posicionar el contenedor en el centro
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Planeta
    const planetRadius = 50;
    const planet = new PIXI.Graphics();
    planet.beginFill(0x00ff00);
    planet.drawCircle(0, 0, planetRadius);
    planet.endFill();
    container.addChild(planet);

    // Nave principal
    const ship = new PIXI.Graphics();
    ship.beginFill(0xff0000);
    ship.drawRect(-10, -5, 20, 10);
    ship.endFill();
    container.addChild(ship);

    // Naves adicionales
    let leftShip = null;
    let rightShip = null;
    let sideShipsAdded = false;

    const orbitRadius = 85;
    ship.x = orbitRadius;
    ship.y = 0;

    let angle = 0;
    const rotationSpeed = 0.05;

    // Desfase angular para las naves laterales
    const sideShipOffsetAngle = Math.PI / 12; // Dividido 12. Subiendo ese nro, quedan mas cerca

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
                shootFromAllShips();
                shootingInterval = setInterval(() => {
                    shootFromAllShips()
                }, 333);
            }
        }
        
        if (e.key === 'k' || e.key === 'K') {
            addSideShips();
        }
        if (e.key === 'l' || e.key === 'L') {
            removeSideShips();
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
        ship.x = Math.cos(angle) * orbitRadius;
        ship.y = Math.sin(angle) * orbitRadius;

        // Apuntar la nave hacia el planeta
        ship.rotation = angle + Math.PI / 2;

        // Actualizar la posición de las naves laterales
        updateSideShipsPosition();

        updateProjectiles();

        // Actualizar la posición de los aliens (movimiento hacia el planeta)
        aliens.forEach(alien => {
            alien.moveTowardsPlanet();
        });

        checkCollisions();
    });

    function shootFromAllShips() {
        shootProjectile(ship, angle);
                    if (sideShipsAdded) {
                        shootProjectile(leftShip, angle - sideShipOffsetAngle);
                        shootProjectile(rightShip, angle + sideShipOffsetAngle);
                    }
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

    function addSideShips() {
        if (!sideShipsAdded) {
            leftShip = new PIXI.Graphics();
            leftShip.beginFill(0x0000ff);
            leftShip.drawRect(-10, -5, 20, 10);
            leftShip.endFill();
            container.addChild(leftShip);

            rightShip = new PIXI.Graphics();
            rightShip.beginFill(0x0000ff);
            rightShip.drawRect(-10, -5, 20, 10);
            rightShip.endFill();
            container.addChild(rightShip);

            sideShipsAdded = true;
            updateSideShipsPosition();
        }
    }

    // Función para sacar las naves laterales
    function removeSideShips() {
        if (sideShipsAdded) {
            container.removeChild(leftShip);
            container.removeChild(rightShip);
            leftShip = null;
            rightShip = null;
            sideShipsAdded = false;
        }
    }

    // Posicionar las naves laterales en la misma órbita, pero con un desfase angular
    function updateSideShipsPosition() {
        if (sideShipsAdded) {
            // Nave izquierda (desfase hacia un lado)
            leftShip.x = Math.cos(angle - sideShipOffsetAngle) * orbitRadius;
            leftShip.y = Math.sin(angle - sideShipOffsetAngle) * orbitRadius;

            // Nave derecha (desfase hacia el otro lado)
            rightShip.x = Math.cos(angle + sideShipOffsetAngle) * orbitRadius;
            rightShip.y = Math.sin(angle + sideShipOffsetAngle) * orbitRadius;

            // Apuntar las naves laterales hacia el planeta
            leftShip.rotation = angle - sideShipOffsetAngle + Math.PI / 2;
            rightShip.rotation = angle + sideShipOffsetAngle + Math.PI / 2;
        }
    }

    // Generar aliens cada cierto tiempo (esto va por fuera del tick)
    setInterval(() => {
        const alien = new Alien(container, app, alienSpeed);
        aliens.push(alien);
    }, 1000);    
}
