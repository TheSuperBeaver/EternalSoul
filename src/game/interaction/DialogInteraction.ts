import TextBox from "../../../phaser3-rex-plugins/templates/ui/textbox/TextBox";
import { Interaction } from "./Interaction";
import { createTextBox } from "../../utils/TextUtils";
import { ChangeMapScene } from "../ChangeMapScene";
import { MapInteractions } from "../MapInteractions";
import { DialogContentValue } from "./DialogContentValue";

export class DialogInteraction extends Interaction {

    content: DialogContentValue[];
    textBox: TextBox;

    constructor(id: number,
        x: number,
        y: number,
        width: number,
        height: number,
        actionButton: string,
        text: string,
        content: string,
        mapInteractions: MapInteractions,
    ) {

        super(id, x, y, width, height, actionButton, text, mapInteractions);
        this.content = JSON.parse(content);
    }

    callAction(scene: ChangeMapScene): any {
        createTextBox(scene, 500, 550, this, {
            width: 500,
            height: 150
        });
    }

    destroy(): void {
        this.textBox?.destroy();
    }
}