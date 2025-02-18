import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {

        this.add.image(540, 1200, 'background').setScale(2.0);

        const grass = this.add.layer();

        const trees = ['Spruce-1', 'Spruce-2', 'Spruce-3', 'Spruce-5', 'Spruce-6', 'Flower_1', 'Flower_2', 'Flower_3', 'Flower_4', 'Tree-1', 'Tree-2', 'Tree-3', 'Wood-2', 'Bush-1', 'Bush-3'];

        for (let i = 0; i < 128; i++) {
            let x = Phaser.Math.Between(0, 1080);
            let y = Phaser.Math.Between(100, 4800);

            let frame = Phaser.Utils.Array.GetRandom(trees);

            let tree = this.add.image(x, y, 'forest', frame);

            tree.setDepth(y);
            tree.setOrigin(0.5, 1);

            grass.add(tree);
        }

        const camera = this.cameras.main;

        camera.postFX.addTiltShift(0.5, 2.0, 0.4);

        this.tweens.add({
            targets: camera,
            scrollY: 1000,
            duration: 20000,
            yoyo: true,
            loop: -1
        });

        const uiCamera = this.cameras.add(0, 0, 1080, 2400);
        uiCamera.ignore(this.children.list);
        const logo = this.add.image(540, 1000, 'logo').setScrollFactor(0).setOrigin(0.5, 0);

        uiCamera.ignore([]);
        uiCamera.startFollow(logo, false, 0, 0);

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
