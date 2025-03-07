import { Scene } from 'phaser';
import { MobileControls } from '../game/MobileControls';
import { MainCharacter } from '../game/MainCharacter';
import { GameMap } from '../game/GameMap';
import { WitchHutMap } from '../game/maps/WitchHutMap';

export class MainGame extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    clouds: Phaser.GameObjects.TileSprite;
    controls: MobileControls;
    mainCharacter: MainCharacter;
    controlsCamera: Phaser.Cameras.Scene2D.Camera;
    map: GameMap;

    preload() {
        this.load.scenePlugin('DisplayListWatcher', 'https://cdn.jsdelivr.net/npm/phaser-plugin-display-list-watcher@1.2.1');
    }

    constructor() {
        super("MainGame");
    }

    create() {
        this.controls = new MobileControls(this);
        this.mainCharacter = new MainCharacter(this, 105, 430, this.controls);
        this.controlsCamera = this.cameras.add(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.map = new WitchHutMap(this, this.mainCharacter);

        this.cameras.main.setBounds(0, 0, this.map.map.widthInPixels, this.map.map.heightInPixels);

        this.clouds = this.add.tileSprite(0, 0, 0, 0, 'clouds');
        this.clouds.setOrigin(0, 0);
        this.clouds.setScrollFactor(0);
        this.clouds.setDepth(100);

        this.cameras.main.postFX.addVignette(0.5, 0.5, 0.9, 0.2);
        this.cameras.main.startFollow(this.mainCharacter);
        this.cameras.main.ignore([this.controls.joystick.base, this.controls.joystick.thumb, this.controls.button, this.mainCharacter]);
        this.controlsCamera.ignore(this.map.map.layers.map(layer => layer.tilemapLayer));
        this.controlsCamera.ignore([this.clouds]);
    }

    update() {
        this.mainCharacter.update();
        this.map.update();

        this.clouds.tilePositionX += 0.5;
        this.clouds.tilePositionY += 0.1;
    }
}
