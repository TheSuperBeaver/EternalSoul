export class Interaction {

    x: number;
    y: number;
    width: number;
    height: number;
    action: string;
    text: string;
    scene: string | undefined;
    toPosition: string | undefined;

    constructor(x: number, y: number, width: number, height: number, action: string, text: string, scene: string | undefined, toPosition: string | undefined) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.action = action;
        this.text = text;
        this.scene = scene;
        this.toPosition = toPosition;
    }

}