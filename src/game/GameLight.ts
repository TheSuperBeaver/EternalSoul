export class GameLight {

    x: number;
    y: number;
    type: string;
    radius: number;
    rgb: number;
    intensity: number;

    constructor(x: number, y: number, type: string, radius: number, rgb: number, intensity: number) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = radius;
        this.rgb = rgb;
        this.intensity = intensity;
    }

}