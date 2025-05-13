import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {

        this.add.image(750, 375, 'background').setScale(2.0);

        const grass = this.add.layer();

        const trees = ['Spruce-1', 'Spruce-2', 'Spruce-3', 'Spruce-5', 'Spruce-6', 'Flower_1', 'Flower_2', 'Tree-1', 'Tree-2', 'Tree-3', 'Wood-2', 'Bush-1', 'Bush-3'];

        for (let i = 0; i < 64; i++) {
            let x = Phaser.Math.Between(0, 1500);
            let y = Phaser.Math.Between(100, 750 * 2);

            let frame = Phaser.Utils.Array.GetRandom(trees);

            let tree = this.add.image(x, y, 'forest', frame);

            tree.setDepth(y);
            tree.setOrigin(0.5, 1);

            grass.add(tree);
        }

        const camera = this.cameras.main;

        this.tweens.add({
            targets: camera,
            scrollY: 350,
            duration: 10000,
            yoyo: true,
            loop: -1
        });

        const uiCamera = this.cameras.add(0, 0, 1500, 750);
        uiCamera.ignore(this.children.list);
        const logo = this.add.image(750, 0, 'logo').setScrollFactor(0).setOrigin(0.5, 0).setScale(0.75);

        logo.enableFilters();

        const fx1 = logo.filters?.external.addGlow(0xb056ac, 5, 0, 2, false, 16);
        const fx2 = logo.filters?.external.addGlow(0xffffff, 1, 0, 2, false, 8);

        this.tweens.add({
            targets: fx1,
            outerStrength: 3,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout'
        });
        this.tweens.add({
            targets: fx2,
            outerStrength: 2,
            yoyo: true,
            loop: -1,
            ease: 'sine.out'
        });
        uiCamera.ignore([]);
        uiCamera.startFollow(logo, false, 0, 0);

        this.input.once('pointerdown', () => {
            camera.once('camerafadeoutcomplete', () => {
                this.scene.start('Story');
            });
            camera.fade(2500, 0, 0, 0);
            uiCamera.fade(1000, 0, 0, 0);
        });
    }
}
