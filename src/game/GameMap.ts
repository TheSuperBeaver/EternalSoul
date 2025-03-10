import { ChangeMapScene } from "./ChangeMapScene";
import { Interaction } from "./Interaction";
import { MainCharacter } from "./MainCharacter";
import { MapPosition } from "./MapPosition";
import { MobileControls } from "./MobileControls";

export abstract class GameMap {
    debug: boolean = false;

    scene: ChangeMapScene;
    mainCharacter: MainCharacter;
    mapKey: string;
    map: Phaser.Tilemaps.Tilemap;
    tilesetImages: { [key: string]: string };
    scaleValue: number;
    interactions: Interaction[] = [];
    positions: { [key: string]: MapPosition } = {};
    interactionText: Phaser.GameObjects.Text;
    interactionTitle: Phaser.GameObjects.Image;
    mobileControls: MobileControls;
    clouds: Phaser.GameObjects.TileSprite;

    constructor(scene: ChangeMapScene, mainCharacter: MainCharacter, mobileControls: MobileControls, mapKey: string, tilesetImages: { [key: string]: string }, scaleValue: number = 2) {
        this.map = scene.make.tilemap({ key: mapKey });
        this.mainCharacter = mainCharacter;
        this.scene = scene;
        this.mobileControls = mobileControls;
        this.mapKey = mapKey;
        this.tilesetImages = tilesetImages;
        this.scaleValue = scaleValue;
    }

    create(): void {
        Object.keys(this.tilesetImages).forEach(key => {
            this.map.addTilesetImage(key, this.tilesetImages[key]);
        });

        this.map.layers.forEach(layerData => {
            this.createLayer(layerData);
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

        this.interactionText = this.scene.add.text(0, 0, '',
            {
                fontSize: '30px',
                color: '#05558E',
                fontFamily: 'Gabriola',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2,
                shadow: { offsetX: 3, offsetY: 3, blur: 1 }
            }).
            setOrigin(0.5).
            setVisible(false);

        this.interactionTitle = this.scene.add.image(0, 0, 'title').setScale(1).setVisible(true);
        const interactionContainer = this.scene.add.container(512, 50, [this.interactionTitle, this.interactionText]);
        const fx1 = interactionContainer.postFX.addGlow(0xeeeeee, 1, 0, false, 0.1, 32);
        this.scene.tweens.add({
            targets: fx1,
            outerStrength: 4,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout'
        });

        const positionsObjects = this.map.getObjectLayer('Positions')?.objects;
        positionsObjects?.forEach(obj => {
            const positionKey = obj.properties.find((prop: { name: string; }) => prop.name === 'position')?.value || '';
            this.positions[positionKey] = new MapPosition(
                (obj.x ?? 0) * this.scaleValue,
                (obj.y ?? 0) * this.scaleValue
            );
        });

        const startPosition = positionsObjects?.find(obj => obj.properties.find((prop: { name: string; }) => prop.name === 'position')?.value === 'start');
        this.mainCharacter.setX((startPosition?.x ?? 0) * this.scaleValue);
        this.mainCharacter.setY((startPosition?.y ?? 0) * this.scaleValue);
    };

    isWithinEllipse(px: number, py: number, cx: number, cy: number, width: number, height: number): boolean {
        const dx = px - (cx + width / 2);
        const dy = py - (cy + height / 2);
        return (dx * dx) / (width * width / 4) + (dy * dy) / (height * height / 4) <= 1;
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
            this.interactionTitle.setVisible(true);
            if (closePoint.action === 'scene') {
                this.mobileControls.setButtonAction(() => {
                    if (closePoint.scene) {
                        this.scene.changeMap(closePoint.scene);
                    }
                });
            }
        } else {
            this.interactionText.setVisible(false);
            this.interactionTitle.setVisible(false);
            this.mobileControls.resetButtonAction();
        }
    };

    createLayer(layerData: Phaser.Tilemaps.LayerData) {
        const depth = (layerData.properties as { name: string, value: any }[]).find(prop => prop.name === 'depth')?.value || 0;
        const layer = this.map.createLayer(layerData.name, this.map.tilesets);
        if (layer) {

            layer.setScale(this.scaleValue);
            layer.setDepth(depth);
            layer.setName(layerData.name);
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
    }
}
