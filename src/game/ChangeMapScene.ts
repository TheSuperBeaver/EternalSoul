import { GameCamera } from "./GameCamera";
import UIPlugin from '../../phaser3-rex-plugins/templates/ui/ui-plugin.js';
import TransitionImagePackPlugin from "../../phaser3-rex-plugins/plugins/transitionimage-plugin";

export abstract class ChangeMapScene extends Phaser.Scene {

    gameCamera: GameCamera;
    rexUI: UIPlugin;
    transitionImagePlugin: TransitionImagePackPlugin;

    abstract changeMap(map: string, toPosition: string | undefined): void;

}