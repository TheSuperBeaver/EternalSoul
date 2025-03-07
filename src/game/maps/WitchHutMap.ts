import { GameMap } from "../GameMap";
import { MainCharacter } from "../MainCharacter";

export class WitchHutMap extends GameMap {

    constructor(scene: Phaser.Scene, mainCharacter: MainCharacter) {
        const tilesetImages = {
            'forest_tileset': 'forest_tileset',
            'chalet_tileset': 'chalet_tileset',
            'cooking_tileset': 'cooking_tileset',
            'magic_tileset': 'magic_tileset',
            'spring_outdoors_tileset': 'spring_outdoors_tileset'
        };
        super(scene, mainCharacter, 'witch_hut', tilesetImages);
        super.create();
    }

    update(): void {
        super.update();
    }
}