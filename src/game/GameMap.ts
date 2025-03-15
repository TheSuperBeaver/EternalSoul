import { ChangeMapScene } from "./ChangeMapScene";
import { Clouds } from "./Clouds";
import { GameLight } from "./GameLight";
import { MainCharacter } from "./MainCharacter";
import { MapInteractions } from "./MapInteractions";
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
    positions: { [key: string]: MapPosition } = {};
    lights: GameLight[] = [];
    mapInteractions: MapInteractions;
    controls: MobileControls;
    clouds: Clouds | null;

    constructor(scene: ChangeMapScene, mainCharacter: MainCharacter, mobileControls: MobileControls, mapKey: string, tilesetImages: { [key: string]: string }, cloudTilemap: string | undefined, scaleValue: number = 2) {
        this.mainCharacter = mainCharacter;
        this.scene = scene;
        this.controls = mobileControls;
        this.mapKey = mapKey;
        this.tilesetImages = tilesetImages;
        this.scaleValue = scaleValue;
        this.cloudTilemap = cloudTilemap;
    }

    destroy(): void {
        this.map.layers.forEach(layer => layer.tilemapLayer.destroy());
        this.map.destroy();
        this.scene.physics.world.colliders.destroy();
        this.positions = {};
        this.clouds?.clouds.destroy();
        this.clouds = null;
        this.mapInteractions.destroy();
        this.scene.lights.destroy();
        this.mainCharacter.setLighting(false);
    }

    create(): void {
        this.map = this.scene.make.tilemap({ key: this.mapKey });
        Object.keys(this.tilesetImages).forEach(key => {
            this.map.addTilesetImage(key, this.tilesetImages[key]);
        });
        this.createLights();

        this.map.layers.forEach(layer => {
            this.createLayer(layer);
        });

        this.scene.physics.add.collider(this.mainCharacter,
            this.map.layers.filter(layer => layer.tilemapLayer &&
                (layer.tilemapLayer.layer.properties as { name: string, value: any }[]).
                    find(prop => prop.name === 'collides')?.value).
                map(layer => layer.tilemapLayer));

        if (this.cloudTilemap) {
            this.clouds = new Clouds(this.scene, this.cloudTilemap);
        }

        this.mapInteractions = new MapInteractions(this.scene, this.map, this.mainCharacter, this.controls, this.scaleValue);
        this.mapInteractions.create();
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
            if (this.lights.length > 0) {
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

    createLights() {
        const lightsObjects = this.map.getObjectLayer('Lights')?.objects;
        lightsObjects?.forEach(obj => {
            this.lights.push(new GameLight(
                (obj.x ?? 0) * this.scaleValue,
                (obj.y ?? 0) * this.scaleValue,
                obj.properties.find((prop: { name: string; }) => prop.name === 'type')?.value || '',
                obj.properties.find((prop: { name: string; }) => prop.name === 'radius')?.value || 10,
                obj.properties.find((prop: { name: string; }) => prop.name === 'rgb')?.value || 0,
                obj.properties.find((prop: { name: string; }) => prop.name === 'intensity')?.value || 10
            ));
        });

        if (this.lights.length > 0) {
            this.mainCharacter.activateLights();

            this.lights.forEach(light => {
                this.scene.lights.addLight(light.x, light.y, 200);
                console.log('Light added : ', light);
            })
            this.scene.lights.enable().setAmbientColor(0x111111);
        }
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
                this.mainCharacter.setPosition(1024 / 2, 768 / 2);
            }
        }
    }
}
