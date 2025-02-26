import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.add.image(512, 380, 'background').setScale(2.0);
        this.add.rectangle(512, 380, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(512 - 230, 380, 4, 28, 0xffffff);
        const loadingText = this.add.text(512, 330, 'Chargement ...', { fontSize: '30px', color: '#ffffff', fontFamily: 'Arial Black' }).setOrigin(0.5);

        const assetTextMap: { [key: string]: string } = {
            'forest': 'Chargement  forêt',
            'grass': 'Chargement  herbe',
            'logo': 'Chargement  logo',
            'star': 'Chargement étoile',
            'grimoire': 'Chargement  grimoire',
            'grimoire_open': 'Chargement  grimoire',
            'rexvirtualjoystickplugin': 'Chargement  joystick',
            'story': 'Chargement textes',
            'character': 'Chargement  character',
            'button': 'Chargement boutons',
            'button_down': 'Chargement boutons',
            'button_highlight': 'Chargement boutons',
            'joystick': 'Chargement boutons',
            'joystick_bg': 'Chargement boutons',
            'clouds': 'Chargement décor',
            'fog': 'Chargement décor',
            'witch_hut': 'Chargement décor'
        };

        this.load.on('fileprogress', (file: Phaser.Loader.File) => {
            const displayText = assetTextMap[file.key] || `Chargement : ${file.key}`;
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
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.atlas('forest', 'sprites/glade.png', 'sprites/glade.json');
        this.load.spritesheet('main_char_idle', 'characters/main/idle.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('main_char_walk', 'characters/main/walk.png', { frameWidth: 64, frameHeight: 64 });

        this.load.image('grass', 'background/grass.jpg');

        this.load.image('logo', 'images/logo.png');
        this.load.image('grimoire', 'images/grimoire.png');
        this.load.image('grimoire_open', 'images/grimoire_open.png');
        this.load.image('clouds', 'images/clouds.png');
        this.load.image('fog', 'images/fog.png')
        this.load.image('star', 'images/star.png');

        this.load.image('forest_tileset', 'tiles/forest.png');
        this.load.image('chalet_tileset', 'tiles/chalet_bois.png');
        this.load.image('treetrunk_tileset', 'tiles/treetrunk_tileset.png');

        this.load.tilemapTiledJSON('witch_hut', 'maps/witch_hut.json');

        this.load.image('button', 'buttons/button_fantasy1.png');
        this.load.image('button_down', 'buttons/button_fantasy1d.png');
        this.load.image('button_highlight', 'buttons/button_fantasy1h.png');
        this.load.image('joystick_bg', 'buttons/joystick_bg.png');
        this.load.image('joystick', 'buttons/joystick.png');

        this.load.json('story', 'texts/story.json');

        this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);


    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
