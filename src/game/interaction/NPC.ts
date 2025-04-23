import { Scene } from "phaser";

export class NPC {
    id: string;
    model: string;
    positions: Phaser.Math.Vector2[];
    moveSpeed: number;
    sprite: Phaser.GameObjects.Sprite;

    constructor(scene: Scene, scaleValue: integer, id: string, model: string, moveSpeed: number, positions: Phaser.Math.Vector2[] = []) {
        this.id = id;
        this.model = model;
        this.positions = positions;
        this.moveSpeed = moveSpeed;

        this.sprite = scene.add.sprite(this.positions[0].x, this.positions[0].y, this.model);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setScale(scaleValue);
        this.sprite.setDepth(20);
        this.sprite.setVisible(true);

        this.sprite.enableFilters();
        const glowFX = this.sprite.filters?.external.addGlow(0x181614, 0.5, 0, 2, false, 16);

        scene.tweens.add({
            targets: glowFX,
            outerStrength: 4,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout'
        });

        scene.anims.create({
            key: 'move',
            frames: scene.anims.generateFrameNumbers(this.model, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        const timelineEvents: Phaser.Types.Time.TimelineEventConfig[] = [];

        console.log("Positions :", this.positions);

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
        const timeline = scene.add.timeline(timelineEvents);
        timeline.play();

        scene.anims.play('move', this.sprite);
    }

    private calculateDuration(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2): number {
        const distance = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
        return (distance / this.moveSpeed) * 1000; // Convert speed to duration in milliseconds
    }
}