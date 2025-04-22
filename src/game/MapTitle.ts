import { ChangeMapScene } from "./ChangeMapScene";

export class MapTitle {

    mapText: Phaser.GameObjects.Text;
    mapTitle: Phaser.GameObjects.Image;
    mapContainer: Phaser.GameObjects.Container;
    scene: ChangeMapScene;

    constructor(scene: ChangeMapScene) {
        this.scene = scene;
        this.mapText = scene.add.text(0, 0, '',
            {
                fontSize: '28px',
                color: '#000000',
                fontFamily: 'Dreamwood',
                fontStyle: 'bold'
            }).
            setOrigin(0.5).
            setName('map_text').
            setDepth(400).
            setAlpha(0);
        this.mapTitle = scene.add.image(0, 0, 'bandeau').
            setName('map_title').
            setScale(0.9).
            setOrigin(0.5).
            setDepth(300).
            setAlpha(0);

        this.mapContainer = scene.add.container(750, 100, [this.mapTitle, this.mapText]).
            setDepth(300).
            setName('map_container').
            setAlpha(0);
    }

    public destroy() {
        this.mapTitle.destroy();
        this.mapText.destroy();
        this.mapContainer.destroy();
    }

    public setMapTitle(title: string) {
        this.mapText.setText(title);
    }

    public showAndFadeOut() {
        this.scene.tweens.killTweensOf(this.mapText);
        this.mapText.setVisible(true);
        this.mapTitle.setVisible(true);
        this.mapContainer.setVisible(true);
        this.scene.tweens.add({
            targets: [this.mapText, this.mapTitle, this.mapContainer],
            alpha: 1,
            duration: 500,
            delay: 2000,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: [this.mapText, this.mapTitle, this.mapContainer],
                    alpha: 0,
                    duration: 1000,
                    delay: 5000,
                    onComplete: () => {
                        this.mapText.setVisible(false);
                        this.mapTitle.setVisible(false);
                        this.mapContainer.setVisible(false);
                    }
                });
            }
        });
    }

}