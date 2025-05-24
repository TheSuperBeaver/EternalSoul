import { MainCharacter } from "../MainCharacter";
import { ChangeMapScene } from "../ChangeMapScene";

export abstract class NPC {
    id: string;
    model: string;
    positions: Phaser.Math.Vector2[];
    moveSpeed: number;
    sprite: Phaser.Physics.Arcade.Sprite;
    chasingPlayer = false;
    canChasePlayer = false;
    timeline: Phaser.Time.Timeline;
    scene: ChangeMapScene;

    constructor(scene: ChangeMapScene, scaleValue: integer, id: string, model: string, moveSpeed: number, positions: Phaser.Math.Vector2[] = [], character: MainCharacter) {
        this.id = id;
        this.model = model;
        this.positions = positions;
        this.moveSpeed = moveSpeed;
        this.scene = scene;

        this.sprite = scene.physics.add.sprite(this.positions[0].x, this.positions[0].y, this.model);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setScale(scaleValue);
        this.sprite.setDepth(20);
        this.sprite.setVisible(true);

        scene.anims.create({
            key: 'move',
            frames: scene.anims.generateFrameNumbers(this.model, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.createNewTimeline();

        scene.anims.play('move', this.sprite);
    }

    createNewTimeline() {
        const timelineEvents: Phaser.Types.Time.TimelineEventConfig[] = [];

        for (let i = 1; i < this.positions.length; i++) {
            const target = this.positions[i];
            timelineEvents.push({
                at: this.calculateDuration(this.positions[i - 1], target) * (i - 1),

                tween: {
                    targets: this.sprite,
                    x: target.x,
                    y: target.y,
                    duration: this.calculateDuration(this.positions[i - 1], target),

                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                }
            });
        }
        this.timeline = this.scene.add.timeline(timelineEvents);
        this.timeline.play();
        console.log("Timeline created for NPC", this.timeline);
    }

    calculateDuration(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2): number {
        const distance = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
        return (distance / this.moveSpeed) * 1000; // Convert speed to duration in milliseconds
    }

    abstract startChasing(): void;

    abstract update(delta: number, player: Phaser.Physics.Arcade.Sprite): void;
}