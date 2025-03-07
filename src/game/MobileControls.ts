import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';

export class MobileControls {
    scene: Phaser.Scene;
    joystick: VirtualJoystick;
    button: Phaser.GameObjects.Image;
    cursorKeys: any;
    buttonAction: () => void;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.button = scene.add.image(876, 680, 'button_empty')
            .setDisplaySize(100, 100)
            .setInteractive()
            .setDepth(100)
            .on('pointerdown', () => {
                if (this.buttonAction) {
                    this.buttonAction();
                }
            });

        this.joystick = new VirtualJoystick(scene, {
            x: 150,
            y: 680,
            radius: 50,
            base: scene.add.image(0, 0, 'joystick_bg').
                setDisplaySize(100, 100).
                setDepth(100),
            thumb: scene.add.image(0, 0, 'joystick').
                setDisplaySize(60, 60).
                setDepth(100)
        });

        this.cursorKeys = this.joystick.createCursorKeys();
    }
}