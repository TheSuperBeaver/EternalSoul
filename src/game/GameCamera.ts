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
        const mapWidth = map.map.widthInPixels * map.scaleValue;
        const mapHeight = map.map.heightInPixels * map.scaleValue;
        const screenWidth = this.scene.scale.width;
        const screenHeight = this.scene.scale.height;

        // Set the bounds for the camera and the map
        this.mainCamera.setBounds(0, 0, mapWidth, mapHeight);

        if (mapWidth < screenWidth || mapHeight < screenHeight) {
            const offsetX = Math.max(0, (screenWidth - mapWidth) / 2);
            const offsetY = Math.max(0, (screenHeight - mapHeight) / 2);
            this.mainCamera.setViewport(offsetX, offsetY, mapWidth, mapHeight);
            this.controlsCamera.setViewport(offsetX, offsetY, mapWidth, mapHeight);
        } else {
            this.mainCamera.setViewport(0, 0, screenWidth, screenHeight);
            this.controlsCamera.setViewport(0, 0, mapWidth, mapHeight);
        }

        this.mainCamera.startFollow(this.mainCharacter);
        this.mainCamera.pan(this.mainCharacter.x, this.mainCharacter.y, 1000, 'Linear', true);
        this.mainCamera.ignore([map.mapInteractions.interactionContainer, map.mapInteractions.interactionText, map.mapInteractions.interactionTitle]);

        this.controlsCamera.ignore(map.map.layers.map(layer => layer.tilemapLayer));
        this.controlsCamera.ignore(this.mainCharacter);
        if (map.clouds) {
            this.controlsCamera.ignore(map.clouds.clouds);
        }
    }
}