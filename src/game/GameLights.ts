import { GameLight } from "./GameLight";
import { GameMap } from "./GameMap";

export class GameLights {

    lights: GameLight[] = [];
    gameMap: GameMap;

    constructor(gameMap: GameMap) {
        this.gameMap = gameMap;
    }

    destroy() {
        this.lights = [];
        this.gameMap.scene.lights.destroy();
    }

    create() {
        const lightLayer = this.gameMap.map.getObjectLayer('Lights');
        const lightsObjects = lightLayer?.objects;
        lightsObjects?.forEach(obj => {

            const rgbString = obj.properties.find((prop: { name: string; }) => prop.name === 'rgb')?.value || '0xffffff';
            const rgbValue = parseInt(rgbString.replace('#', ''), 16); // Convert string to numeric RGB value

            this.lights.push(new GameLight(
                (obj.x ?? 0) * this.gameMap.scaleValue,
                (obj.y ?? 0) * this.gameMap.scaleValue,
                obj.properties.find((prop: { name: string; }) => prop.name === 'type')?.value || '',
                obj.properties.find((prop: { name: string; }) => prop.name === 'radius')?.value || 10,
                rgbValue,
                obj.properties.find((prop: { name: string; }) => prop.name === 'intensity')?.value || 10
            ));
        });

        if (this.lights.length > 0) {
            this.gameMap.mainCharacter.activateLights();

            this.lights.forEach(light => {
                const newLight = this.gameMap.scene.lights.addLight(light.x, light.y, light.radius, light.rgb, light.intensity);
                switch (light.type) {
                    case 'glow':
                        this.gameMap.scene.tweens.add(
                            {
                                targets: newLight,
                                radius: light.radius * 3,
                                intensity: light.intensity * 2,
                                ease: 'Sine.easeInOut',
                                yoyo: true,
                                repeat: -1,
                                duration: 5000
                            }
                        )
                        return;
                    case 'lamp':
                        return;
                    case 'ceiling':
                        this.gameMap.scene.tweens.add(
                            {
                                targets: newLight,
                                y: newLight.y + 50,
                                ease: 'Back.easeIn',
                                yoyo: true,
                                repeat: -1,
                                duration: 7000,
                            }
                        )
                        return;
                    default:

                }
            })
            const ambientProperty = (lightLayer?.properties as { name: string; value: any }[]).find((prop: { name: string; }) => prop.name === 'ambient');
            const ambientColorString = ambientProperty?.value || '#333333';
            const ambientColorValue = parseInt(ambientColorString.replace('#', ''), 16);

            this.gameMap.scene.lights.enable().setAmbientColor(ambientColorValue);
        }
    }

}