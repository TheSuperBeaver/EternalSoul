import VirtualJoystick from '../../phaser3-rex-plugins/plugins/virtualjoystick.js';

export class MobileControls {
    scene: Phaser.Scene;
    joystick: VirtualJoystick;
    button: Phaser.GameObjects.Image;
    cursorKeys: any;
    buttonAction: () => void;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.button = scene.add.image(1350, 650, 'button_green_back')
            .setDisplaySize(150, 150)
            .setInteractive()
            .setDepth(100)
            .setName('button')
            .on('pointerdown', () => {
                this.button.setDisplaySize(140, 140);
                if (this.buttonAction) {
                    this.buttonAction();
                }
            })
            .on('pointerup', () => {
                this.button.setDisplaySize(200, 200);
            });

        this.joystick = new VirtualJoystick(scene, {
            x: 150,
            y: 650,
            radius: 50,
            base: scene.add.image(0, 0, 'joystick_bg').
                setName('joystick_base').
                setDisplaySize(150, 150).
                setDepth(100),
            thumb: scene.add.image(0, 0, 'joystick').
                setName('joystick_thumb').
                setDisplaySize(135, 135).
                setDepth(100)
        });

        this.cursorKeys = this.joystick.createCursorKeys();
    }

    setButtonAction(action: () => void, texture: string = "button_green"): void {
        this.button.setTexture(texture);
        this.buttonAction = action;
    }

    resetButtonAction(): void {
        this.button.setTexture("button_green_back");
        this.buttonAction = () => { };
    }
}