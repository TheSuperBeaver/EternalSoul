import { Boot } from './scenes/Boot';
import { MainGame } from './scenes/MainGame';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Story } from './scenes/Story';

import { Game, Types } from "phaser";

const config: Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 1500,
    height: 750,
    parent: 'game-container',
    backgroundColor: '#111111',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Story,
        MainGame
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
                x: 0
            },
            debug: false
        }
    },
    fullscreenTarget: 'game-container',



};

export default new Game(config);
