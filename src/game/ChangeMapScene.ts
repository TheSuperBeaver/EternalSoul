import { GameCamera } from "./GameCamera";
import UIPlugin from '../../phaser3-rex-plugins/templates/ui/ui-plugin.js';

export abstract class ChangeMapScene extends Phaser.Scene {

    gameCamera: GameCamera;
    rexUI: UIPlugin;

    abstract changeMap(map: string, toPosition: string | undefined): void;

}