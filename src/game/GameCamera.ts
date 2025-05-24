import Phaser from "phaser";
import { MobileControls } from "./MobileControls";
import { MainCharacter } from "./MainCharacter";
import { GameMap } from "./GameMap";

export class GameCamera {

    private scene: Phaser.Scene;

    mainCamera: Phaser.Cameras.Scene2D.Camera;
    controlsCamera: Phaser.Cameras.Scene2D.Camera;

    controls: MobileControls;
    mainCharacter: MainCharacter;

    constructor(scene: Phaser.Scene, mainCharacter: MainCharacter, controls: MobileControls) {
        this.scene = scene;
        this.mainCharacter = mainCharacter;
        this.controls = controls
    }

    create() {
        this.mainCamera = this.scene.cameras.main;
        const ctrl = this.mainCamera.filters.external.addGlow(0x000000, 10, 5, 1, false, 10);
        this.scene.tweens.add({
            targets: [ctrl],
            scale: 1.5,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: Phaser.Math.Easing.Quadratic.InOut
        });

        this.mainCamera.ignore([
            this.controls.joystick.base,
            this.controls.joystick.thumb,
            this.controls.button
        ]);

        this.controlsCamera = this.scene.cameras.add(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);
    }

    changeMap(map: GameMap) {
        this.mainCamera.startFollow(this.mainCharacter);
        this.mainCamera.pan(this.mainCharacter.x, this.mainCharacter.y, 1000, 'Linear', true);
        this.mainCamera.ignore([map.mapInteractions.interactionContainer, map.mapInteractions.interactionText, map.mapInteractions.interactionTitle]);

        this.controlsCamera.ignore(map.map.layers.map(layer => layer.tilemapLayer));
        this.controlsCamera.ignore(this.mainCharacter);
        map.clouds.forEach(cloud => {
            this.controlsCamera.ignore(cloud.clouds);
        });
    }
}