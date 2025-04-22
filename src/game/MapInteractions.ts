import { Types } from "phaser";
import { ChangeMapScene } from "./ChangeMapScene";
import { Interaction } from "./interaction/Interaction";
import { MainCharacter } from "./MainCharacter";
import { MobileControls } from "./MobileControls";
import { DialogInteraction } from "./interaction/DialogInteraction";
import { SceneInteraction } from "./interaction/SceneInteration";
import { MapTitle } from "./MapTitle";

export class MapInteractions {

    interactions: Interaction[] = [];
    interactionText: Phaser.GameObjects.Text;
    interactionTitle: Phaser.GameObjects.Image;
    interactionContainer: Phaser.GameObjects.Container;

    mapTitle: MapTitle;

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
        this.interactionContainer.destroy();

        this.mapTitle.destroy();
    }

    create() {
        this.interactionText = this.scene.add.text(0, 0, '',
            {
                fontSize: '30px',
                color: '#000000',
                fontFamily: 'Dreamwood',
                fontStyle: 'bold'
            }).
            setOrigin(0.5).
            setName('interaction_text').
            setDepth(200);

        this.interactionTitle = this.scene.add.image(0, 0, 'scroll_2').
            setName('title_image').
            setScale(0.5, 0.2).
            setDepth(200);
        this.interactionContainer = this.scene.add.container(1350, 500, [this.interactionTitle, this.interactionText]).
            setDepth(200).
            setName('interaction')
            ;

        this.mapTitle = new MapTitle(this.scene);

        this.scene.gameCamera.mainCamera.ignore([this.interactionText, this.interactionTitle, this.interactionContainer, this.mapTitle.mapContainer, this.mapTitle.mapText, this.mapTitle.mapTitle]);

        const interactionObjects = this.map.getObjectLayer('Interactions')?.objects;
        interactionObjects?.forEach(interaction => {
            this.extractInteraction(interaction);
        });
    }

    private extractInteraction(interaction: Phaser.Types.Tilemaps.TiledObject) {
        const action = interaction.properties.find((prop: { name: string; }) => prop.name === 'action')?.value || '';
        switch (action) {
            case "scene":
                this.createSceneInteraction(interaction);
                break;
            case "dialog":
                this.createDialogInteraction(interaction);
                break;
            case "start":
                this.createStartInteraction(interaction);;
                break;
            default:
                console.log("Action type " + action + " is not yet developped");
        }
    }

    createStartInteraction(interaction: Types.Tilemaps.TiledObject) {
        const mapTitle = interaction.properties.find((prop: { name: string; }) => prop.name === 'map_title')?.value || null;
        this.mapTitle.setMapTitle(mapTitle);
        this.mapTitle.showAndFadeOut();
    }

    createDialogInteraction(interaction: Types.Tilemaps.TiledObject) {
        this.interactions.push(new DialogInteraction(
            interaction.id,
            interaction.x ?? 0,
            interaction.y ?? 0,
            interaction.width ?? 0,
            interaction.height ?? 0,
            interaction.properties.find((prop: { name: string; }) => prop.name === 'action_button')?.value || '',
            interaction.properties.find((prop: { name: string; }) => prop.name === 'text')?.value || '',
            interaction.properties.find((prop: { name: string; }) => prop.name === 'content')?.value || '',
            this));
    }

    createSceneInteraction(interaction: Types.Tilemaps.TiledObject) {
        this.interactions.push(new SceneInteraction(
            interaction.id,
            interaction.x ?? 0,
            interaction.y ?? 0,
            interaction.width ?? 0,
            interaction.height ?? 0,
            interaction.properties.find((prop: { name: string; }) => prop.name === 'action_button')?.value || '',
            interaction.properties.find((prop: { name: string; }) => prop.name === 'text')?.value || '',
            interaction.properties.find((prop: { name: string; }) => prop.name === 'scene')?.value || null,
            interaction.properties.find((prop: { name: string; }) => prop.name === 'to_position')?.value || null,
            this));
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
            this.controls.setInteraction(closePoint);
        } else {
            this.interactionText.setVisible(false);
            this.interactionTitle.setVisible(false);
            this.controls.resetInteraction();
        }
    }

    isWithinEllipse(px: number, py: number, cx: number, cy: number, width: number, height: number): boolean {
        const dx = px - (cx + width / 2);
        const dy = py - (cy + height / 2);
        return (dx * dx) / (width * width / 4) + (dy * dy) / (height * height / 4) <= 1;
    }
}