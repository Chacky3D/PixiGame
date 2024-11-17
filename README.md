# 'Orbital Arousal'

Juego desarrollado mediante la herramiente PixiJS, para la materia 'Programación de Videojuegos I' de la carrera 'Tecnicatura Universitaria en Programación de Videojuegos' de la 'Universidad Nacional de Hurlingham'.

# Controles:

- 'A' | 'D' para orbitar alrededor de la estrella.
- 'ESPACIO' para disparar proyectil común. (Se puede mantener presionado)
- 'SHIFT' para mantener el disparo común constante sin necesidad de tener pulsada la tecla 'ESPACIO'. (Se desactiva de igual manera)
- 'LEFT MOUSE' para ejecutar disparo laser.
- 'CONTROL' para abrir el menú de compra, que permite agregar una nave a la flota (opción superior) o aumentar la cadencia de disparo (opción inferior).

# Comportamiento de los objetos:

## Player

![Player](./readme-images/player_ship1.png)

- Orbita alrededor de la estrella.
- Puede disparar.
- Mediante el click puede lazar un rayo desde la estrella que elimina a los enemigos.
- Puede añadir naves a su flota y/o mejorar la cadencia de disparo.

## Normal (Enemy)

![Normal Enemy](./readme-images/enemy1_ship1.png)

- Se mueve hacia la estrella.
- Puede colisionar con la estrella.
- Puede ser eliminado tanto con disparos comunes como con el laser.

## Doge (Enemy)

![Doge Enemy](./readme-images/enemy2_ship1.png)

- Se mueve hacia la estrella.
- Puede colisionar con la estrella.
- Puede esquivar proyectiles.
- Solo puede ser eliminado mediante el laser.

## Comander (Enemy)

![Commander Enemy](./readme-images/commander_ship1.png)

- Se mueve hacia la estrella.
- Ordena a dos aliados que lo protejan a modo de escudo.
- Solo puede ser eliminado mediante el disparo común (inmune al laser).

## Asteroid

![Asteroid](./readme-images/asteroid1.png)

- Se mueve evitando la estrella.
- Da créditos que se pueden utilizar para comprar mejoras.
- Solo puede ser eliminado mediante el laser.

## Star

![Star](./readme-images/star1.png)

- Pierde un punto de vida cada vez que una nave colisiona con ella.
- Puede ser destruida, finalizando el juego.

# Objetivos:

- Defender la estrella de las naves invasoras.
- Alcanzar la mayor cantidad de puntos posibles.

# Aclaraciones:

- A medida que el tiempo avanza, la velocidad de movimiento y la frecuencia de aparición de los aliens aumenta.

# Integrantes:

- Ariel Aguilar
- Diego Longo
- Carlos Ibarra