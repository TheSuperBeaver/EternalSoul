import { Scene } from 'phaser';

export class Story extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    onceupon: Phaser.GameObjects.Text;
    intro: Phaser.GameObjects.Text;
    grimoire: Phaser.GameObjects.Image;
    grimoireOpen: Phaser.GameObjects.Image;
    story: any;

    constructor() {
        super('Story');
    }

    create() {
        this.story = this.cache.json.get('story');
        this.camera = this.cameras.main;
        this.background = this.add.image(518, 384, 'background');
        this.camera.on('camerafadeincomplete', () => {
            this.grimoire = this.add.image(1024 + 200, 384, 'grimoire');

            this.tweens.add({
                targets: this.grimoire,
                x: 518,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    this.moveGrimoire();
                }
            });
        });

        this.camera.fadeIn(500, 0, 0, 0);
    }

    private moveGrimoire() {
        this.tweens.add({
            targets: this.grimoire,
            y: 384 + 20,
            duration: 250,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.tweens.add({
                    targets: this.grimoire,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        this.openGrimoire();
                    }
                });
            }
        });
    }

    private openGrimoire() {
        this.grimoireOpen = this.add.image(this.grimoire.x, this.grimoire.y, 'grimoire_open').setAlpha(0);
        this.grimoire.destroy();

        this.tweens.add({
            targets: this.grimoireOpen,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                this.writeIntro();
            }
        });
    }

    private writeIntro() {
        this.onceupon = this.add.text(518, 330, '', {
            fontFamily: 'Alex Brush', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5, 0.5);
        this.typewriteText(this.story.onceupon, this.onceupon, () => {
            this.intro = this.add.text(518, 330 + 100, '', {
                fontFamily: 'Gabriola', fontSize: 38, color: '#ffffff',
                stroke: '#000000', strokeThickness: 4,
                align: 'center'
            }).setOrigin(0.5, 0.5);
            this.typewriteText(this.story.intro, this.intro, () => {
                this.createButton();
            })
        });
    }

    createButton() {
        const buttonImage = this.add.image(0, 0, 'button').setAlpha(0);
        const buttonText = this.add.text(0, 0, 'Continuer', { fontFamily: 'Gabriola', fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);

        const buttonContainer = this.add.container(512, 650, [buttonImage, buttonText]);

        // Fade in the button
        this.tweens.add({
            targets: buttonImage,
            alpha: 1,
            duration: 500
        });

        buttonImage.setInteractive();

        buttonImage.on('pointerover', () => {
            buttonImage.setTexture('button_highlight');
            buttonText.setFontSize(32);
        });

        buttonImage.on('pointerout', () => {
            buttonImage.setTexture('button');
        });

        buttonImage.on('pointerdown', () => {
            buttonImage.setTexture('button_down');
        });

        buttonImage.on('pointerup', () => {
            buttonImage.setTexture('button');
            this.camera.fadeOut(500, 0, 0, 0).once('camerafadeoutcomplete', () => {
                this.scene.start('Chapter1');
            });
        });
    }

    typewriteText(text: string, textObject: Phaser.GameObjects.Text, onComplete?: () => void) {
        const length = text.length;
        let i = 0;

        this.time.addEvent({
            callback: () => {
                textObject.text += text[i];
                ++i;
                if (i === length && onComplete) {
                    onComplete();
                }
            },
            repeat: length - 1,
            delay: 60
        });
    }
}
