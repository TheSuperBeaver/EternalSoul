import { ChangeMapScene } from "../ChangeMapScene";
import { GameMap } from "../GameMap";
import { MainCharacter } from "../MainCharacter";
import { MobileControls } from "../MobileControls";

export class WitchHutMap extends GameMap {

    constructor(scene: ChangeMapScene, mainCharacter: MainCharacter, mobileControls: MobileControls) {
        const tilesetImages = {
            'forest_tileset': 'forest_tileset',
            'chalet_tileset': 'chalet_tileset',
            'cooking_tileset': 'cooking_tileset',
            'magic_tileset': 'magic_tileset',
            'spring_outdoors_tileset': 'spring_outdoors_tileset'
        };
        super(scene, mainCharacter, mobileControls, 'witch_hut', tilesetImages, ['clouds'], 2, 1);
    }
}