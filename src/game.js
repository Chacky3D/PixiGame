// Crear y arrancar PIXI
const app = new PIXI.Application();

app.init({
    //width: window.innerWidth,
    //height: window.innerHeight,
    width: 1024,
    height: 768,
    backgroundColor: 0x1099bb
}).then(() => {
    document.body.appendChild(app.view);

    runGame(app);
});

function runGame(app){
    // Contenedor para todos los objetos con posición
    const container = new PIXI.Container();
    app.stage.addChild(container);

    // Posicionar el contenedor en el centro
    // Con esto, todo objeto hijo de container en x = 0 e y = 0 está en el centro de la pantalla
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Crear el planeta
    const planetRadius = 50;
    const planet = new PIXI.Graphics();
    planet.beginFill(0x00ff00); // Empieza a pintar con verde
    planet.drawCircle(0, 0, planetRadius); // Dibuja un círculo
    planet.endFill(); // Deja de pintar
    container.addChild(planet);

    // Crear la nave principal
    const ship = new PIXI.Graphics();
    ship.beginFill(0xff0000);
    ship.drawRect(-10, -5, 20, 10);  // Nave rectangular
    ship.endFill();
    container.addChild(ship);

    // Crear variables para las naves adicionales. Después vamos a tener que manejar mejor esto, tal vez con un array para que sea dinámico.
    // Depende de la complejidad de las naves.
    let leftShip = null;
    let rightShip = null;
    let sideShipsAdded = false;

    // Posicionar la nave en la órbita del planeta
    const orbitRadius = 150; // Ver si esta distancia va a ser dinámica... creo que no
    ship.x = orbitRadius;
    ship.y = 0;

    // Variables para la órbita de la nave
    let angle = 0;
    const rotationSpeed = 0.05;  // Velocidad de rotación

    // Desfase angular para las naves laterales
    const sideShipOffsetAngle = Math.PI / 12; // Dividido 12 es como una por cada porción de pizza de una pizza de 12, subiendo ese nro, quedan mas cerca

    // Manejo de teclas. O sea, para q lado rota
    let rotateClockwise = false;
    let rotateCounterClockwise = false;

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
            shootProjectile(ship, angle);
            if (sideShipsAdded) {
                shootProjectile(leftShip, angle - sideShipOffsetAngle);
                shootProjectile(rightShip, angle + sideShipOffsetAngle);
            }
        }
        if (e.key === 'k' || e.key === 'K') { // Si se presiona "K"
            addSideShips();
        }
        if (e.key === 'l' || e.key === 'L') { // Si se presiona "L"
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

        // Actualizar la posición de los aliens (movimiento hacia el planeta)
        aliens.forEach(alien => {
            alien.x -= Math.cos(alien.angleToPlanet) * alienSpeed;
            alien.y -= Math.sin(alien.angleToPlanet) * alienSpeed;
        });

        // Verificar colisiones entre proyectiles y aliens
        checkCollisions();
    });

    // Función para disparar un proyectil desde una nave en su propia dirección
    function shootProjectile(ship, shipAngle) {
        const projectile = new PIXI.Graphics();
        projectile.beginFill(0xffff00); // Color del proyectil (amarillo)
        projectile.drawCircle(0, 0, 5); // Tamaño del proyectil
        projectile.endFill();

        // Posicionar el proyectil en la posición actual de la nave
        projectile.x = ship.x;
        projectile.y = ship.y;

        // Guardar la dirección del proyectil basado en el ángulo actual de la nave
        projectile.direction = {
            x: Math.cos(shipAngle),
            y: Math.sin(shipAngle)
        };

        // Añadir el proyectil al contenedor y a la lista de proyectiles
        container.addChild(projectile);
        projectiles.push(projectile);
    }

    // Función para agregar las naves laterales
    function addSideShips() {
        if (!sideShipsAdded) {
            // Crear la nave izquierda
            leftShip = new PIXI.Graphics();
            leftShip.beginFill(0x0000ff);
            leftShip.drawRect(-10, -5, 20, 10);  // Nave rectangular azul
            leftShip.endFill();
            container.addChild(leftShip);

            // Crear la nave derecha
            rightShip = new PIXI.Graphics();
            rightShip.beginFill(0x0000ff);
            rightShip.drawRect(-10, -5, 20, 10);  // Nave rectangular azul
            rightShip.endFill();
            container.addChild(rightShip);

            sideShipsAdded = true;
            updateSideShipsPosition();  // Posicionar las naves
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

    // Función para crear un alien que aparece fuera de la pantalla y se mueve hacia el planeta
    function spawnAlien() {
        const alien = new PIXI.Graphics();
        alien.beginFill(0xff00ff); // Alien color rosa
        alien.drawCircle(0, 0, 15); // Tamaño del alien
        alien.endFill();

        // Calcular una posición aleatoria fuera de la pantalla
        // Es interesante que la aleatoriedad de la posición hace que la entrada a la pantalla tmb sea aleatoria aunque el tiempo de invocación de esta func sea regular
        const angleToPlanet = Math.random() * Math.PI * 2;
        const spawnDistance = Math.max(app.screen.width, app.screen.height) / 2 + 100; // Afuera de la pantalla

        alien.x = Math.cos(angleToPlanet) * spawnDistance;
        alien.y = Math.sin(angleToPlanet) * spawnDistance;

        // Guardar el ángulo hacia el planeta
        alien.angleToPlanet = angleToPlanet;

        container.addChild(alien);
        aliens.push(alien);
    }

    // Función para verificar colisiones entre proyectiles y aliens
    function checkCollisions() {
        for (let i = aliens.length - 1; i >= 0; i--) {
            const alien = aliens[i];
            for (let j = projectiles.length - 1; j >= 0; j--) {
                const projectile = projectiles[j];

                // Distancia entre el alien y el proyectil
                const distX = alien.x - projectile.x;
                const distY = alien.y - projectile.y;
                const distance = Math.sqrt(distX * distX + distY * distY);

                // Si están lo suficientemente cerca, hay colisión
                if (distance < 15 + 5) { // 15 es el radio del alien, 5 es el del proyectil
                    // Eliminar alien y proyectil
                    container.removeChild(alien);
                    container.removeChild(projectile);
                    aliens.splice(i, 1);
                    projectiles.splice(j, 1);
                    break;
                }
            }
        }
    }

    // Generar aliens cada cierto tiempo (esto va por fuera del tick)
    setInterval(spawnAlien, 1000); // Cada 1 segundo
}
