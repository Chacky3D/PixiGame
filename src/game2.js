class Game {
    constructor() {
        this.app = new PIXI.Application({
            width: 1024,
            height: 768,
            backgroundColor: 0x1099bb
        });
        document.body.appendChild(this.app.view);
        
        // Contenedor para todos los objetos con posición
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.projectiles = [];
        this.aliens = [];
        this.ship = new Ship(this.container);
        
        this.rotationSpeed = 0.05;
        this.angle = 0;

        this.initEvents();
        this.app.ticker.add(this.update.bind(this));
        setInterval(this.spawnAlien.bind(this), 1000);
    }

    initEvents() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'a' || e.key === 'A') {
                this.ship.rotateCounterClockwise = true;
            }
            if (e.key === 'd' || e.key === 'D') {
                this.ship.rotateClockwise = true;
            }
            if (e.key === ' ') {
                this.ship.shoot(this.projectiles, this.container);
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'a' || e.key === 'A') {
                this.ship.rotateCounterClockwise = false;
            }
            if (e.key === 'd' || e.key === 'D') {
                this.ship.rotateClockwise = false;
            }
        });
    }

    update() {
        this.ship.updatePosition(this.angle);
        this.updateProjectiles();
        this.updateAliens();
        this.checkCollisions();
    }

    updateProjectiles() {
        this.projectiles.forEach((projectile, index) => {
            projectile.update();
            if (projectile.isOutOfBounds(this.app.screen)) {
                this.container.removeChild(projectile.graphics);
                this.projectiles.splice(index, 1);
            }
        });
    }

    updateAliens() {
        this.aliens.forEach(alien => {
            alien.moveTowardsPlanet();
        });
    }

    spawnAlien() {
        const alien = new Alien(this.container, this.app.screen);
        this.aliens.push(alien);
    }

    checkCollisions() {
        this.aliens.forEach((alien, alienIndex) => {
            this.projectiles.forEach((projectile, projIndex) => {
                if (alien.checkCollision(projectile)) {
                    this.container.removeChild(alien.graphics);
                    this.container.removeChild(projectile.graphics);
                    this.aliens.splice(alienIndex, 1);
                    this.projectiles.splice(projIndex, 1);
                }
            });
        });
    }
}








// Clase para la nave
class Ship {
    constructor(container) {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xff0000);
        this.graphics.drawRect(-10, -5, 20, 10);  // Nave rectangular
        this.graphics.endFill();
        container.addChild(this.graphics);
        
        this.orbitRadius = 150;
        this.angle = 0;
        this.rotationSpeed = 0.05;
        this.rotateClockwise = false;
        this.rotateCounterClockwise = false;
    }

    updatePosition(angle) {
        if (this.rotateClockwise) {
            this.angle += this.rotationSpeed;
        }
        if (this.rotateCounterClockwise) {
            this.angle -= this.rotationSpeed;
        }
        
        this.graphics.x = Math.cos(this.angle) * this.orbitRadius;
        this.graphics.y = Math.sin(this.angle) * this.orbitRadius;
        this.graphics.rotation = this.angle + Math.PI / 2;
    }

    shoot(projectiles, container) {
        const projectile = new Projectile(this.graphics.x, this.graphics.y, this.angle);
        projectiles.push(projectile);
        container.addChild(projectile.graphics);
    }
}

// Clase para los proyectiles
class Projectile {
    constructor(x, y, angle) {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xffff00);
        this.graphics.drawCircle(0, 0, 5);
        this.graphics.endFill();

        this.graphics.x = x;
        this.graphics.y = y;
        
        this.speed = 2;
        this.direction = { x: Math.cos(angle), y: Math.sin(angle) };
    }

    update() {
        this.graphics.x += this.direction.x * this.speed;
        this.graphics.y += this.direction.y * this.speed;
    }

    isOutOfBounds(screen) {
        return this.graphics.x < 0 || this.graphics.x > screen.width || this.graphics.y < 0 || this.graphics.y > screen.height;
    }
}

// Clase para los aliens
class Alien {
    constructor(container, screen) {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xff00ff);
        this.graphics.drawCircle(0, 0, 15);
        this.graphics.endFill();

        const angleToPlanet = Math.random() * Math.PI * 2;
        const spawnDistance = Math.max(screen.width, screen.height) / 2 + 100;
        
        this.graphics.x = Math.cos(angleToPlanet) * spawnDistance;
        this.graphics.y = Math.sin(angleToPlanet) * spawnDistance;
        this.angleToPlanet = angleToPlanet;
        
        this.speed = 0.8;
        container.addChild(this.graphics);
    }

    moveTowardsPlanet() {
        this.graphics.x -= Math.cos(this.angleToPlanet) * this.speed;
        this.graphics.y -= Math.sin(this.angleToPlanet) * this.speed;
    }

    checkCollision(projectile) {
        const distX = this.graphics.x - projectile.graphics.x;
        const distY = this.graphics.y - projectile.graphics.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance < 15 + 5;  // 15 es el radio del alien, 5 es el del proyectil
    }
}

// Inicializar el juego
new Game();