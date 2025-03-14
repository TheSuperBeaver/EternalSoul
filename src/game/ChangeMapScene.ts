export abstract class ChangeMapScene extends Phaser.Scene {

    abstract changeMap(map: string, toPosition: string | undefined): void;

}