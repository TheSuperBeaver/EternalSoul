export class Clouds {
    clouds: Phaser.GameObjects.TileSprite;
    constructor(scene: Phaser.Scene, tilemap: string = 'clouds') {
        this.clouds = scene.add.tileSprite(0, 0, 0, 0, tilemap);
        this.clouds.setOrigin(0, 0);
        //this.clouds.setScrollFactor(0);
        this.clouds.setDepth(100);
        this.clouds.setName(tilemap);
    }
    update() {
        this.clouds.tilePositionX += 0.5;
    }

    destroy() {
        this.clouds.destroy();
    }
}