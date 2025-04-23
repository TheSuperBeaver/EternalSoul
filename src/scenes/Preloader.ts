import { Scene } from 'phaser';

export class Preloader extends Scene {
    private assetTextMap: { [key: string]: string } = {};

    constructor() {
        super('Preloader');
    }

    init() {
        this.add.image(750, 375, 'background').setScale(2.0);
        this.add.rectangle(750, 400, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(750 - 230, 400, 4, 28, 0xffffff);
        const loadingText = this.add.text(750, 350, 'Chargement ...', { fontSize: '30px', color: '#ffffff', fontFamily: 'Arial Black' }).setOrigin(0.5);

        this.load.on('fileprogress', (file: Phaser.Loader.File) => {
            const displayText = this.assetTextMap[file.key] || `Chargement : ${file.key}`;
            loadingText.setText(displayText);
        });

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
        });

        this.load.on('complete', () => {
            loadingText.setText('Chargement complet');
        });
    }

    preload() {
        // Load the assets JSON file
        this.load.json('assets', 'assets/assets.json');
    }

    create() {
        // Get the assets data from the loaded JSON file
        const assets = this.cache.json.get('assets').assets;

        // Initialize the assetTextMap
        assets.forEach((asset: { key: string, type: string, path: string, text?: string, data?: any, frameWidth?: number, frameHeight?: number }) => {
            this.assetTextMap[asset.key] = asset.text || 'Default';

            switch (asset.type) {
                case 'atlas':
                    this.load.atlas(asset.key, asset.path, asset.data);
                    break;
                case 'spritesheet':
                    this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth ?? 32, frameHeight: asset.frameHeight ?? 32 });
                    break;
                case 'image':
                    this.load.image(asset.key, asset.path);
                    break;
                case 'tilemapTiledJSON':
                    this.load.tilemapTiledJSON(asset.key, asset.path);
                    break;
                case 'json':
                    this.load.json(asset.key, asset.path);
                    break;
                case 'plugin':
                    this.load.plugin(asset.key, asset.path, true);
                    break;
                default:
                    console.warn(`Unknown asset type: ${asset.type}`);
            }
        });

        // Start loading the assets
        this.load.start();

        // When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        // For example, you can define global animations here, so we can use them in other scenes.

        // Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.load.on('complete', () => {
            this.scene.start('MainMenu');
        });
    }
}