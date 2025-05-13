import { ChangeMapScene } from "../ChangeMapScene";
import { GameMap } from "../GameMap";
import { MainCharacter } from "../MainCharacter";
import { MobileControls } from "../MobileControls";

export class LostForestMap extends GameMap {

    constructor(scene: ChangeMapScene, mainCharacter: MainCharacter, mobileControls: MobileControls) {
        const tilesetImages = {
            'forest_tileset': 'forest_tileset',
            'forest_2': 'forest_2',
            'swamp_tileset': 'swamp_tileset',
            'props': 'props',
            'spring_outdoors_tileset': 'spring_outdoors_tileset',
            'treetrunk_tileset': 'treetrunk_tileset',
            'bonfire': 'bonfire',
            'tileset-3': 'tileset-3',
        };
        super(scene, mainCharacter, mobileControls, 'lost_forest', tilesetImages, 'clouds', 2, 2);
    }

    update(): void {
        super.update();
    }
}