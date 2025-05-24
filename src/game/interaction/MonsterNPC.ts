import { MainCharacter } from "../MainCharacter";
import { NPC } from "./NPC";
import { ChangeMapScene } from "../ChangeMapScene";

export class MonsterNPC extends NPC {

    canChasePlayer = true;
    chasingPlayer = false;

    constructor(scene: ChangeMapScene, scaleValue: integer, id: string, model: string, moveSpeed: number, positions: Phaser.Math.Vector2[] = [], character: MainCharacter) {
        super(scene, scaleValue, id, model, moveSpeed, positions, character);

        const glowFX = this.sprite.filters?.external.addGlow(0x181614, 0.5, 0, 2, false, 16);

        if (glowFX) {
            scene.tweens.add({
                targets: glowFX,
                outerStrength: 4,
                yoyo: true,
                loop: -1,
                ease: 'sine.inout'
            });
        }
    }

    startChasing() {
        this.chasingPlayer = true;
        if (this.timeline) {
            this.timeline.stop();
        }
        //this.scene.tweens.killTweensOf(this.sprite);
    }

    stopChasing() {
        this.chasingPlayer = false;
        //this.createNewTimeline();
    }

    update(delta: number, player: Phaser.Physics.Arcade.Sprite): void {

        const dx = player.x - this.sprite.x;
        const dy = player.y - this.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (!this.chasingPlayer && dist < 500) {
            console.log("Start chasing player");
            this.startChasing();
        }

        if (this.chasingPlayer && player) {
            if (dist < 75) {
                console.log("Player is too close, scared !")
                this.scene.cameras.main.shake(1000, 0.01, false, this.shakeCallback);
                this.stopChasing();
            } else if (dist > 800) {
                console.log("Player is too far, stop chasing");
                this.stopChasing();
                this.timeline.play();
            } else {
                console.log("Chasing player");
                const angle = Math.atan2(dy, dx);
                const vx = Math.cos(angle) * this.moveSpeed * (delta / 1000);
                const vy = Math.sin(angle) * this.moveSpeed * (delta / 1000);
                this.sprite.x += vx;
                this.sprite.y += vy;
            }
        }
    }


    shakeCallback(cam = null, progress = 0) {
        if (progress === 1) {
            this.scene.cameras.main.fadeOut(1000, 0, 0, 0, this.fadeCallback);
        }
    }

    fadeCallback(cam = null, progress = 0) {
        if (progress === 1) {
            this.scene.map.moveToPosition('respawn');

            const runawayText = this.scene.add.text(750, 330, 'La peur te fait fuir..', {
                fontFamily: 'Alex Brush', fontSize: 64, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'center'
            }).setOrigin(0.5, 0.5).setAlpha(1);
            this.scene.gameCamera.mainCamera.ignore(runawayText);

            this.scene.tweens.add({
                targets: runawayText,
                alpha: 0,
                duration: 2000,
                onComplete: () => {
                    this.scene.cameras.main.fadeIn(3000, 0, 0, 0);
                    runawayText.destroy();
                }
            });
        }
    }
}