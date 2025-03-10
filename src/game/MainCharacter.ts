import { MobileControls } from './MobileControls';

export class MainCharacter extends Phaser.Physics.Arcade.Sprite {
    speed: number;
    controls: MobileControls;

    constructor(scene: Phaser.Scene, x: number, y: number, joystick: MobileControls, speed: number = 100) {
        super(scene, x, y, 'main_char_idle', 3);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setName('mainCharacter');
        this.setCollideWorldBounds(true);
        this.setScale(1);
        this.setDepth(1);
        this.speed = speed;
        this.controls = joystick;
        this.body?.setCircle(16, this.width / 2 - 16, this.height - 32);

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('main_char_walk', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('main_char_walk', { start: 24, end: 31 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers('main_char_walk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('main_char_walk', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update(): void {
        const cursorKeys = this.controls.cursorKeys;

        let velocityX = 0;
        let velocityY = 0;

        if (cursorKeys.left.isDown) {
            velocityX = -1;
            this.anims.play('left', true);
        } else if (cursorKeys.right.isDown) {
            velocityX = 1;
            this.anims.play('right', true);
        }

        if (cursorKeys.up.isDown) {
            velocityY = -1;
            this.anims.play('up', true);
        } else if (cursorKeys.down.isDown) {
            velocityY = 1;
            this.anims.play('down', true);
        }

        if (velocityX !== 0 || velocityY !== 0) {
            const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            velocityX = (velocityX / length) * this.speed;
            velocityY = (velocityY / length) * this.speed;

            this.setVelocity(velocityX, velocityY);
        } else {
            this.setVelocity(0, 0);
            this.anims.stop();
        }
    }
}