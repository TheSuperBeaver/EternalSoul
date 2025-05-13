import { ChangeMapScene } from "./ChangeMapScene";
import { Clouds } from "./Clouds";
import { GameLights } from "./GameLights";
import { MainCharacter } from "./MainCharacter";
import { MapInteractions } from "./MapInteractions";
import { MapNPCs } from "./MapNPCs";
import { MapPosition } from "./MapPosition";
import { MobileControls } from "./MobileControls";

export abstract class GameMap {
    static debug: boolean = false;
    static filters: boolean = true;

    scene: ChangeMapScene;
    mainCharacter: MainCharacter;
    mapKey: string;
    map: Phaser.Tilemaps.Tilemap;
    tilesetImages: { [key: string]: string };
    cloudTilemap: string | undefined;
    scaleValue: number;
    characterScale: number;
    positions: { [key: string]: MapPosition } = {};
    gameLights: GameLights;
    mapInteractions: MapInteractions;
    controls: MobileControls;
    clouds: Clouds | null;
    mapNpcs: MapNPCs;

    constructor(scene: ChangeMapScene, mainCharacter: MainCharacter, mobileControls: MobileControls, mapKey: string, tilesetImages: { [key: string]: string }, cloudTilemap: string | undefined, scaleValue: number = 2, characterScale: number = 2) {
        this.mainCharacter = mainCharacter;
        this.scene = scene;
        this.controls = mobileControls;
        this.mapKey = mapKey;
        this.tilesetImages = tilesetImages;
        this.scaleValue = scaleValue;
        this.cloudTilemap = cloudTilemap;
        this.characterScale = characterScale;
    }

    destroy(): void {
        this.map.layers.forEach(layer => layer.tilemapLayer.destroy());
        this.map.destroy();
        this.scene.physics.world.colliders.destroy();
        this.positions = {};
        this.clouds?.clouds.destroy();
        this.clouds = null;
        this.mapInteractions.destroy();
        this.gameLights.destroy();
    }

    create(): void {
        this.map = this.scene.make.tilemap({ key: this.mapKey });
        Object.keys(this.tilesetImages).forEach(key => {
            this.map.addTilesetImage(key, this.tilesetImages[key]);
        });

        this.gameLights = new GameLights(this);
        this.gameLights.create();

        this.map.layers.forEach(layer => {
            this.createLayer(layer);
        });
        this.scene.physics.world.setBounds(0, 0, this.map.widthInPixels * this.scaleValue, this.map.heightInPixels * this.scaleValue);
        this.scene.physics.add.collider(this.mainCharacter,
            this.map.layers.filter(layer => layer.tilemapLayer &&
                (layer.tilemapLayer.layer.properties as { name: string, value: any }[]).
                    find(prop => prop.name === 'collides')?.value).
                map(layer => layer.tilemapLayer));

        this.mainCharacter.setScale(this.characterScale);

        if (this.cloudTilemap) {
            this.clouds = new Clouds(this.scene, this.cloudTilemap);
        }

        this.mapInteractions = new MapInteractions(this.scene, this.map, this.mainCharacter, this.controls, this.scaleValue);
        this.mapInteractions.create();
        this.mapNpcs = new MapNPCs(this.scene, this.map, this.mainCharacter, this.controls, this.scaleValue);
        this.mapNpcs.create();
        this.createPositions();
    };

    update(): void {
        this.mapInteractions.update();
        if (this.clouds) {
            this.clouds.update();
        }
    };

    private createLayer(layerData: Phaser.Tilemaps.LayerData) {
        const depth = (layerData.properties as { name: string, value: any }[]).find(prop => prop.name === 'depth')?.value || 0;
        const layer = this.map.createLayer(layerData.name, this.map.tilesets);

        if (layer) {
            layer.setScale(this.scaleValue);
            layer.setDepth(depth);
            layer.setName(layerData.name);
            if ((layerData.properties as { name: string, value: any }[]).find(prop => prop.name === 'collides')?.value) {
                layer.setCollisionByProperty({ collides: true });
                if (GameMap.debug) {
                    layer.renderDebug(this.scene.add.graphics(), {
                        tileColor: null,
                        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200),
                        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
                    });
                }
            }
            if (this.gameLights.lights.length > 0) {
                layer.setLighting(true);
            }
        }
    }

    private createPositions() {
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
    }

    moveToPosition(toPosition: string | undefined) {
        if (toPosition && this.positions[toPosition]) {
            const position = this.positions[toPosition];
            this.mainCharacter.setPosition(position.x, position.y);
        } else {
            const startPosition = this.positions['start'];
            if (startPosition) {
                this.mainCharacter.setPosition(startPosition.x, startPosition.y);
            } else {
                this.mainCharacter.setPosition(1500 / 2, 750 / 2);
            }
        }
    }
}
