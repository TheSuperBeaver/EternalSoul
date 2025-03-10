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
        super(scene, mainCharacter, mobileControls, 'witch_hut', tilesetImages, 2);
        super.create();

        this.clouds = this.scene.add.tileSprite(0, 0, 0, 0, 'clouds');
        this.clouds.setOrigin(0, 0);
        this.clouds.setScrollFactor(0);
        this.clouds.setDepth(100);
        this.clouds.setName('clouds');
    }

    update(): void {
        super.update();
        this.clouds.tilePositionX += 0.5;
        this.clouds.tilePositionY += 0.1;
    }
}