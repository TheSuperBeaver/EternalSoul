import { Interaction } from "./Interaction";
import { MainCharacter } from "./MainCharacter";

export abstract class GameMap {
    debug: boolean = false;

    scene: Phaser.Scene;
    mainCharacter: MainCharacter;
    mapKey: string;
    map: Phaser.Tilemaps.Tilemap;
    tilesetImages: { [key: string]: string };
    scaleValue: number;
    interactions: Interaction[] = [];
    interactionText: Phaser.GameObjects.Text;
    interactionButton: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, mainCharacter: MainCharacter, mapKey: string, tilesetImages: { [key: string]: string }, scaleValue: number = 2) {
        this.map = scene.make.tilemap({ key: mapKey });
        this.mainCharacter = mainCharacter;
        this.scene = scene;
        this.mapKey = mapKey;
        this.tilesetImages = tilesetImages;
        this.scaleValue = scaleValue;
    }

    create(): void {
        Object.keys(this.tilesetImages).forEach(key => {
            this.map.addTilesetImage(key, this.tilesetImages[key]);
        });

        this.map.layers.forEach(layerData => {
            const layer = this.map.createLayer(layerData.name, this.map.tilesets);
            if (layer) {
                const depth = (layerData.properties as { name: string, value: any }[]).find(prop => prop.name === 'depth')?.value || 0;
                layer.setScale(this.scaleValue);
                layer.setDepth(depth);
                if ((layerData.properties as { name: string, value: any }[]).find(prop => prop.name === 'collides')?.value) {
                    layer.setCollisionByProperty({ collides: true });
                    if (this.debug) {
                        layer.renderDebug(this.scene.add.graphics(), {
                            tileColor: null,
                            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200),
                            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
                        });
                    }
                }
            }
        });

        this.scene.physics.add.collider(this.mainCharacter,
            this.map.layers.filter(layer => layer.tilemapLayer &&
                (layer.tilemapLayer.layer.properties as { name: string, value: any }[]).
                    find(prop => prop.name === 'collides')?.value).
                map(layer => layer.tilemapLayer));

        const interactionObjects = this.map.getObjectLayer('Interactions')?.objects;
        interactionObjects?.forEach(obj => {
            this.interactions.push(new Interaction(
                obj.x ?? 0,
                obj.y ?? 0,
                obj.width ?? 0,
                obj.height ?? 0,
                obj.properties.find((prop: { name: string; }) => prop.name === 'action')?.value || '',
                obj.properties.find((prop: { name: string; }) => prop.name === 'text')?.value || '',
                obj.properties.find((prop: { name: string; }) => prop.name === 'scene')?.value || null));
        });

        this.interactionText = this.scene.add.text(0, 0, '', { fontSize: '20px', color: '#ffffff', fontFamily: 'Gabriola' }).setOrigin(0.5).setVisible(true);
        this.interactionButton = this.scene.add.image(0, 0, 'button').setScale(1).setVisible(true);
        this.scene.add.container(512, 50, [this.interactionButton, this.interactionText]);
        this.interactionButton.setInteractive().on('pointerdown', () => {
            this.executeAction();
        });
    };

    isWithinEllipse(px: number, py: number, cx: number, cy: number, width: number, height: number): boolean {
        const dx = px - (cx + width / 2);
        const dy = py - (cy + height / 2);
        return (dx * dx) / (width * width / 4) + (dy * dy) / (height * height / 4) <= 1;
    }

    executeAction() {
        const closePoint = this.interactions.find(point => {
            if (this.mainCharacter.body) {
                const withinEllipse = this.isWithinEllipse(
                    this.mainCharacter.body.position.x / this.scaleValue,
                    this.mainCharacter.body.position.y / this.scaleValue,
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
            console.log(`Executing action: ${closePoint.action}`);
            // Add your action logic here (e.g., open door, open chest)
        }
    }

    update(): void {
        const closePoint = this.interactions.find(point => {
            if (this.mainCharacter.body) {
                const withinEllipse = this.isWithinEllipse(
                    this.mainCharacter.body.position.x / this.scaleValue,
                    this.mainCharacter.body.position.y / this.scaleValue,
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
            this.interactionButton.setVisible(true);
        } else {
            this.interactionText.setVisible(false);
            this.interactionButton.setVisible(false);
        }
    };
}