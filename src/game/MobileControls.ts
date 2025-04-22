import VirtualJoystick from '../../phaser3-rex-plugins/plugins/virtualjoystick.js';
import { Interaction } from './interaction/Interaction.js';

export class MobileControls {
    scene: Phaser.Scene;
    joystick: VirtualJoystick;
    button: Phaser.GameObjects.Image;
    cursorKeys: any;
    interaction: Interaction;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.button = scene.add.image(1350, 650, 'button_green_back')
            .setDisplaySize(150, 150)
            .setInteractive()
            .setDepth(100)
            .setName('button')
            .setVisible(false)
            .on('pointerdown', () => {
                this.button.setDisplaySize(140, 140);
                if (this.interaction) {
                    this.interaction.callAction(scene);
                }
            })
            .on('pointerup', () => {
                this.button.setDisplaySize(200, 200);
            });

        this.joystick = new VirtualJoystick(scene, {
            x: -200,
            y: -200,
            radius: 50,
            base: scene.add.image(0, 0, 'button_skin').
                setName('joystick_base').
                setDisplaySize(150, 150).
                setDepth(100),
            thumb: scene.add.image(0, 0, 'button_nipple').
                setName('joystick_thumb').
                setDisplaySize(125, 125).
                setDepth(100)
        }).setVisible(false);

        this.cursorKeys = this.joystick.createCursorKeys();

        scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.x <= scene.scale.width / 3 && pointer.y >= scene.scale.height / 2) {
                this.joystick.setPosition(pointer.x, pointer.y);
                this.joystick.setVisible(true);
            }
        });

        scene.input.on('pointerup', () => {
            this.joystick.setPosition(-200, -200);
            this.joystick.setVisible(false);
        });
    }

    setInteraction(interaction: Interaction): void {
        this.button.setTexture(interaction.actionButton ?? "button_green").setVisible(true);
        this.interaction = interaction;
    }

    resetInteraction(): void {
        this.button.setTexture("button_green_back").setVisible(false);
        this.interaction?.destroy();
    }
}