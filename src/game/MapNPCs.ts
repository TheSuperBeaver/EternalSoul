import { ChangeMapScene } from "./ChangeMapScene";
import { MainCharacter } from "./MainCharacter";
import { MobileControls } from "./MobileControls";
import { NPC } from "./interaction/NPC";

export class MapNPCs {

    npcs: NPC[] = [];

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
        this.npcs = [];
    }

    create() {
        const npcObjects = this.map.getObjectLayer('NPC')?.objects;
        npcObjects?.forEach(interaction => {
            this.extractNPC(interaction);
        });
    }

    private extractNPC(interaction: Phaser.Types.Tilemaps.TiledObject) {
        const npc = interaction.properties.find((prop: { name: string; }) => prop.name === 'npc')?.value || '';
        const model = interaction.properties.find((prop: { name: string; }) => prop.name === 'model')?.value || '';
        const move_speed = interaction.properties.find((prop: { name: string; }) => prop.name === 'move_speed')?.value || '';

        const positions: Phaser.Math.Vector2[] = [];

        if (interaction.polyline) {
            interaction.polyline.forEach((point) => {
                const relativeX = (interaction.x ?? 0) + point.x;
                const relativeY = (interaction.y ?? 0) + point.y;
                positions.push(new Phaser.Math.Vector2(relativeX * this.scaleValue, relativeY * this.scaleValue));
            });
        }

        this.npcs.push(new NPC(this.scene, this.scaleValue, npc, model, move_speed, positions));
        this.scene.gameCamera.controlsCamera.ignore(this.npcs[this.npcs.length - 1].sprite);
        this.scene.physics.add.collider(this.character, this.npcs[this.npcs.length - 1].sprite);
    }
}