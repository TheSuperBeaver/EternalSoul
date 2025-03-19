import { ChangeMapScene } from "./ChangeMapScene";
import Dialog from "../../phaser3-rex-plugins/templates/ui/dialog/Dialog";
import UIPlugin from '../../phaser3-rex-plugins/templates/ui/ui-plugin';

export class GameDialog {

    scene: ChangeMapScene;
    dialog: Dialog;
    rexUI: UIPlugin;

    constructor(scene: ChangeMapScene) {
        this.scene = scene;
        this.rexUI = new UIPlugin(scene, scene.plugins, 'rexUI');
    }

    create(text: string) {
        this.dialog = this.rexUI.add.dialog({
            x: 750,
            y: 650,
            width: 400,
            background: this.rexUI.add.roundRectangle({
                radius: 15,
                strokeColor: 0x565554,
                strokeWidth: 5,
                color: 0x2E86AB
            }),
            content: this.scene.add.text(
                0,
                0,
                text,
                {
                    fontSize: '25px',
                    fontFamily: 'Carlito',
                    color: '#ffffff'
                }
            ),
            title: this.rexUI.add.label({
                background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 15, 0xF5F749),
                text: this.scene.add.text(0, 0, 'SALEM', {
                    fontSize: '30px',
                    fontFamily: 'Dreamwood',
                    color: '#565554',
                }),
                align: 'center',
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),
            expand: {
                content: true,
                description: true,
                title: true
            },
            align: {
                content: "center",
                title: "center"
            },
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                content: 20,
                title: 20
            }

        }).layout().popUp(1000);

        this.scene.gameCamera.mainCamera.ignore(this.dialog);
    }

    destroy() {
        if (this.dialog) {
            this.dialog.destroy();
        }
    }

}