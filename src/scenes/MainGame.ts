import { MobileControls } from '../game/MobileControls';
import { MainCharacter } from '../game/MainCharacter';
import { GameMap } from '../game/GameMap';
import { WitchHutMap } from '../game/maps/WitchHutMap';
import { WitchHutInteriorMap } from '../game/maps/WitchHutInteriorMap';
import { ChangeMapScene } from '../game/ChangeMapScene';
import { GameCamera } from '../game/GameCamera';
import { LostForestMap } from '../game/maps/LostForestMap';

export class MainGame extends ChangeMapScene {
    controls: MobileControls;
    mainCharacter: MainCharacter;

    map: GameMap;
    maps: { [key: string]: new (...args: any[]) => GameMap } = {};


    preload() {
        if (!GameMap.filters) {
            this.load.scenePlugin('DisplayListWatcher', 'https://cdn.jsdelivr.net/npm/phaser-plugin-display-list-watcher@1.2.1');
        }
    }

    constructor() {
        super("MainGame");
    }

    create() {
        this.controls = new MobileControls(this);
        this.mainCharacter = new MainCharacter(this, 105, 430, this.controls);
        this.gameCamera = new GameCamera(this, this.mainCharacter, this.controls);
        this.gameCamera.create();

        this.maps['witch_hut'] = WitchHutMap;
        this.maps['witch_hut_interior'] = WitchHutInteriorMap;
        this.maps['lost_forest'] = LostForestMap;
        //this.map = new this.maps['witch_hut_interior'](this, this.mainCharacter, this.controls);
        this.map = new this.maps['lost_forest'](this, this.mainCharacter, this.controls);
        this.map.create();
        this.gameCamera.changeMap(this.map);
    }

    update() {
        this.mainCharacter.update();
        this.map.update();
    }

    changeMap(newMap: string, toPosition: string | undefined): void {
        const cam = this.cameras.main;

        // Fade out the current view
        cam.fadeOut(1000, 0, 0, 0);

        // When the fade out is complete, switch to the new map and fade in
        cam.once('camerafadeoutcomplete', () => {
            this.map.destroy();
            this.map = new this.maps[newMap](this, this.mainCharacter, this.controls);
            this.map.create();
            this.map.moveToPosition(toPosition)
            this.gameCamera.changeMap(this.map);

            // Fade in the new view
            cam.fadeIn(1000, 0, 0, 0);
        });
    }
}
