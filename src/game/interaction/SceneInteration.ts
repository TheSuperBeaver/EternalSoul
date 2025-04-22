import { ChangeMapScene } from "../ChangeMapScene";
import { MapInteractions } from "../MapInteractions";
import { Interaction } from "./Interaction";

export class SceneInteraction extends Interaction {

    scene: string;
    toPosition: string;

    constructor(id: number,
        x: number,
        y: number,
        width: number,
        height: number,
        actionButton: string,
        text: string,
        scene: string,
        toPosition: string,
        mapInteractions: MapInteractions) {

        super(id, x, y, width, height, actionButton, text, mapInteractions);
        this.scene = scene;
        this.toPosition = toPosition;
    }

    callAction(scene: ChangeMapScene): any {
        scene.changeMap(this.scene, this.toPosition);
    }

    destroy(): void {
        // Nothing to do here
    }

}