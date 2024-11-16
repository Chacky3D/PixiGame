import { container } from "./GameManager.js";
export class LaserBeam
{
    constructor(event)
    {
        this.rect = new PIXI.Graphics();
        this.rectHeight = 5;
        this.rectWidth = 1000;
        this.mousePosition = {
            x: event.data.global.x,
            y: event.data.global.y
        }
        this.initLaserBeam();
        this.updateRotation();
    }

    initLaserBeam()
    {
        this.rect.beginFill(0xF9C22B);
        this.rect.drawRect(-this.rectHeight / 2, -this.rectHeight / 2, this.rectWidth, this.rectHeight);
        this.rect.endFill();
        container.addChildAt(this.rect, 0)
    }

    updateRotation()
    {
        // Calcular el ángulo entre el rectángulo y el mouse
        const dx = this.mousePosition.x - this.rect.getGlobalPosition().x;
        const dy = this.mousePosition.y - this.rect.getGlobalPosition().y;
        const angle = Math.atan2(dy, dx);

        // Rotar el rectángulo
        this.rect.rotation = angle;
        setTimeout(this.destroy.bind(this), 100)
    }

    destroy()
    {
        container.removeChild(this.rect);
    }
}