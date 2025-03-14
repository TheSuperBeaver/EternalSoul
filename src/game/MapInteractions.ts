import { ChangeMapScene } from "./ChangeMapScene";
import { Interaction } from "./Interaction";
import { MainCharacter } from "./MainCharacter";
import { MobileControls } from "./MobileControls";

export class MapInteractions {

    interactions: Interaction[] = [];
    interactionText: Phaser.GameObjects.Text;
    interactionTitle: Phaser.GameObjects.Image;

    scene: ChangeMapScene;
    map: Phaser.Tilemaps.Tilemap;
    character: MainCharacter;
    controls: MobileControls;
    scaleValue: number;

    constructor(scene: ChangeMapScene, map: Phaser.Tilemaps.Tilemap, character: MainCharacter, controls: MobileControls, scaleValue: number) {
        this.scene = scene;
        this.map = map;
        this.character = character;
        this.controls = controls;
        this.scaleValue = scaleValue;
    }

    destroy() {
        this.interactions = [];
        this.interactionText.destroy();
        this.interactionTitle.destroy();
    }

    create() {
        const interactionObjects = this.map.getObjectLayer('Interactions')?.objects;
        interactionObjects?.forEach(obj => {
            this.interactions.push(new Interaction(
                obj.x ?? 0,
                obj.y ?? 0,
                obj.width ?? 0,
                obj.height ?? 0,
                obj.properties.find((prop: { name: string; }) => prop.name === 'action')?.value || '',
                obj.properties.find((prop: { name: string; }) => prop.name === 'text')?.value || '',
                obj.properties.find((prop: { name: string; }) => prop.name === 'scene')?.value || null,
                obj.properties.find((prop: { name: string; }) => prop.name === 'to_position')?.value || null));
        });

        this.interactionText = this.scene.add.text(-20, 25, '',
            {
                fontSize: '30px',
                color: '#000000',
                fontFamily: 'Dreamwood',
                fontStyle: 'bold'
            }).
            setOrigin(0.5).
            setName('interaction_text').
            setDepth(200).
            setVisible(false);

        this.interactionTitle = this.scene.add.image(0, 0, 'wood_sign').
            setName('title_image').
            setScale(0.6).
            setDepth(200).
            setVisible(false);
        this.scene.add.container(512, 50, [this.interactionTitle, this.interactionText]).
            setDepth(200).
            setName('interaction')
            ;
    }

    update() {
        const closePoint = this.interactions.find(point => {
            if (this.character.body) {
                const withinEllipse = this.isWithinEllipse(
                    this.character.body.position.x / this.scaleValue,
                    this.character.body.position.y / this.scaleValue,
                    point.x,
                    point.y,
                    point.width,
                    point.height
                );
                return withinEllipse;
            }
            return false;
        });

        if (closePoint) {
            this.interactionText.setText(closePoint.text).setVisible(true);
            this.interactionTitle.setVisible(true);
            if (closePoint.action === 'scene') {
                this.controls.setButtonAction(() => {
                    if (closePoint.scene) {
                        this.scene.changeMap(closePoint.scene, closePoint.toPosition);
                    }
                }, "button_door");
            } else if (closePoint.action === 'make_potion') {
                this.controls.setButtonAction(() => { }, "button_skin_nipple");
            } else if (closePoint.action === 'pet_cat') {
                this.controls.setButtonAction(() => { }, "button_cat");
            }
        } else {
            this.interactionText.setVisible(false);
            this.interactionTitle.setVisible(false);
            this.controls.resetButtonAction();
        }
    }

    isWithinEllipse(px: number, py: number, cx: number, cy: number, width: number, height: number): boolean {
        const dx = px - (cx + width / 2);
        const dy = py - (cy + height / 2);
        return (dx * dx) / (width * width / 4) + (dy * dy) / (height * height / 4) <= 1;
    }
}