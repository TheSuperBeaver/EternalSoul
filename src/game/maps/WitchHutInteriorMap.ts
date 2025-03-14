import { ChangeMapScene } from "../ChangeMapScene";
import { GameMap } from "../GameMap";
import { MainCharacter } from "../MainCharacter";
import { MobileControls } from "../MobileControls";

export class WitchHutInteriorMap extends GameMap {

    constructor(scene: ChangeMapScene, mainCharacter: MainCharacter, mobileControls: MobileControls) {
        const tilesetImages = {
            'magic_tileset': 'magic_tileset',
            'rug_hut_tileset': 'rug_hut_tileset'
        };
        super(scene, mainCharacter, mobileControls, 'witch_hut_interior', tilesetImages, '', 1);
    }

    update(): void {
        super.update();
    }
}