import { Scene } from 'phaser';
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';


export class Chapter1 extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    character: Phaser.GameObjects.Sprite;
    clouds: Phaser.GameObjects.TileSprite;
    controlsCamera: Phaser.Cameras.Scene2D.Camera;
    joystick: VirtualJoystick;

    constructor() {
        super('Chapter1');
    }

    create() {
        const witch_hut = this.make.tilemap({ key: 'witch_hut' });
        witch_hut.addTilesetImage('forest_tileset', 'forest_tileset');
        witch_hut.addTilesetImage('chalet_tileset', 'chalet_tileset');
        witch_hut.addTilesetImage('treetrunk_tileset', 'treetrunk_tileset');

        witch_hut.createLayer('bg', 'forest_tileset');
        witch_hut.createLayer('walls', 'forest_tileset');
        witch_hut.createLayer('floor', 'forest_tileset');
        witch_hut.createLayer('decor', ['forest_tileset', 'chalet_tileset', 'treetrunk_tileset']);
        witch_hut.createLayer('details', ['chalet_tileset', 'forest_tileset']);

        //this.controlsCamera = this.cameras.add(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.createControls();
        this.createCharacter();
        this.cameras.main.setBounds(0, 0, witch_hut.widthInPixels, witch_hut.heightInPixels);

        this.clouds = this.add.tileSprite(0, 0, 0, 0, 'clouds');
        this.clouds.setOrigin(0, 0);
        this.clouds.setScrollFactor(0);

        this.cameras.main.startFollow(this.character);
    }

    private createControls() {
        this.joystick = this.createJoystick();

        const button = this.add.circle(1024 - 150, 680, 50, 0xcccccc).setStrokeStyle(2, 0xdedede)
            .setInteractive()
            .on('pointerdown', function () {
                console.log('button down');
            });
    }

    private createCharacter() {
        this.character = this.add.sprite(512, 384, 'main_char_idle', 3);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('main_char_walk', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('main_char_walk', { start: 24, end: 31 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('main_char_walk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('main_char_walk', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        const speed = 100;
        const cursorKeys = this.joystick.createCursorKeys();

        let velocityX = 0;
        let velocityY = 0;

        if (cursorKeys.left.isDown) {
            velocityX = -1;
            this.character.anims.play('left', true);
        } else if (cursorKeys.right.isDown) {
            velocityX = 1;
            this.character.anims.play('right', true);
        }

        if (cursorKeys.up.isDown) {
            velocityY = -1;
            this.character.anims.play('up', true);
        } else if (cursorKeys.down.isDown) {
            velocityY = 1;
            this.character.anims.play('down', true);
        }

        if (velocityX !== 0 || velocityY !== 0) {
            const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            velocityX = (velocityX / length) * speed;
            velocityY = (velocityY / length) * speed;

            this.character.x += velocityX * this.game.loop.delta / 1000;
            this.character.y += velocityY * this.game.loop.delta / 1000;
        } else {
            this.character.anims.stop();
        }

        this.clouds.tilePositionX += 0.5;
        this.clouds.tilePositionY += 0.1;
    }

    private createJoystick() {
        return new VirtualJoystick(this, {
            x: 150,
            y: 680,
            radius: 50,
            base: this.add.image(0, 0, 'joystick_bg').setDisplaySize(100, 100),
            thumb: this.add.image(0, 0, 'joystick').setDisplaySize(60, 60)
        });
    }
}
