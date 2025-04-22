import { Boot } from './scenes/Boot';
import { MainGame } from './scenes/MainGame';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Story } from './scenes/Story';
import { Game, Types } from "phaser";
import TransitionImagePackPlugin from "../phaser3-rex-plugins/plugins/transitionimage-plugin";
import UIPlugin from '../phaser3-rex-plugins/templates/ui/ui-plugin';
import BBCodeTextPlugin from '../phaser3-rex-plugins/plugins/bbcodetext-plugin';
import InputTextPlugin from '../phaser3-rex-plugins/plugins/inputtext-plugin';


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
    plugins: {
        global: [{
            key: 'rexInputTextPlugin',
            plugin: InputTextPlugin,
            start: true
        }, {
            key: 'rexBBCodeTextPlugin',
            plugin: BBCodeTextPlugin,
            start: true
        }, {
            key: 'rexTransitionImagePackPlugin',
            plugin: TransitionImagePackPlugin,
            start: true
        }],
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }]
    }
};

export default new Game(config);
