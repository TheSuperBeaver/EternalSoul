import { MobileControls } from '../game/MobileControls';
import { MainCharacter } from '../game/MainCharacter';
import { GameMap } from '../game/GameMap';
import { WitchHutMap } from '../game/maps/WitchHutMap';
import { ChangeMapScene } from '../game/ChangeMapScene';

export class MainGame extends ChangeMapScene {
    camera: Phaser.Cameras.Scene2D.Camera;
    controls: MobileControls;
    mainCharacter: MainCharacter;
    controlsCamera: Phaser.Cameras.Scene2D.Camera;
    map: GameMap;
    maps: { [key: string]: GameMap } = {};

    preload() {
        this.load.scenePlugin('DisplayListWatcher', 'https://cdn.jsdelivr.net/npm/phaser-plugin-display-list-watcher@1.2.1');
        this.load.image('arrow_up', 'assets/images/arrow-up.png'); // Load arrow up image
        this.load.image('arrow_down', 'assets/images/arrow-down.png'); // Load arrow down image
    }

    constructor() {
        super("MainGame");
    }

    create() {
        this.controls = new MobileControls(this);
        this.mainCharacter = new MainCharacter(this, 105, 430, this.controls);
        this.map = new WitchHutMap(this, this.mainCharacter, this.controls);
        this.maps['witch_hut'] = this.map;

        const cam = this.cameras.main;
        cam.setBounds(0, 0, this.map.map.widthInPixels, this.map.map.heightInPixels);
        cam.postFX.addVignette(0.5, 0.5, 0.9, 0.2);
        cam.startFollow(this.mainCharacter);
        cam.ignore([this.controls.joystick.base, this.controls.joystick.thumb, this.controls.button, this.mainCharacter]);

        this.controlsCamera = this.cameras.add(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.controlsCamera.ignore(this.map.map.layers.map(layer => layer.tilemapLayer));
        this.controlsCamera.ignore([this.map.clouds]);

        // Add arrow up button
        this.add.image(50, 50, 'arrow_up')
            .setInteractive()
            .setDepth(100)
            .setScale(0.1)
            .on('pointerdown', () => {
                this.mainCharacter.setDepth(this.mainCharacter.depth + 1);

            });

        // Add arrow down button
        this.add.image(50, 100, 'arrow_down')
            .setInteractive()
            .setDepth(100)
            .setScale(0.1)
            .on('pointerdown', () => {
                this.mainCharacter.setDepth(this.mainCharacter.depth - 1);
            });
    }

    update() {
        this.mainCharacter.update();
        this.map.update();
    }

    changeMap(newMap: string) {
        console.log("Change map to ", newMap);
    }
}
