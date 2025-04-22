import { MapInteractions } from "../MapInteractions";

export abstract class Interaction {

    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    actionButton: string;
    text: string;
    mapInteractions: MapInteractions;

    constructor(id: number,
        x: number,
        y: number,
        width: number,
        height: number,
        actionButton: string,
        text: string,
        mapInteractions: MapInteractions) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.actionButton = actionButton;
        this.text = text;
        this.mapInteractions = mapInteractions;
    }

    abstract destroy(): void;

    abstract callAction(object: any): any;

}