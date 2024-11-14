export class SpatialHash {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    // Obtiene la clave de celda en base a la posición
    getCellKey(x, y) {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return `${cellX},${cellY}`;
    }

    // Agrega un alien a una celda
    insert(alien) {
        const key = this.getCellKey(alien.flyingObjectContainer.x, alien.flyingObjectContainer.y);
        
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key).push(alien);
    }

    // Obtiene los aliens cercanos
    getNearby(x, y) {
        const cellKey = this.getCellKey(x, y);
        const [cellX, cellY] = cellKey.split(',').map(Number); // Divide y convierte a números
        const neighbors = [];

        // Revisa las celdas adyacentes
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const adjacentKey = `${cellX + dx},${cellY + dy}`;
                if (this.grid.has(adjacentKey)) {
                    neighbors.push(...this.grid.get(adjacentKey));
                }
            }
        }
        return neighbors;
    }

    clear() {
        this.grid.clear();
    }
}