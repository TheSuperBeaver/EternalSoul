import { ChangeMapScene } from "../game/ChangeMapScene";
import { DialogContentValue } from "../game/interaction/DialogContentValue";
import { DialogInteraction } from "../game/interaction/DialogInteraction";
const COLOR_MAIN = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const GetValue = Phaser.Utils.Objects.GetValue;

type TextBoxConfig = {
    width?: number;
    height?: number;
    wrapWidth?: number;
    fixedWidth?: number;
    fixedHeight?: number;
    typingMode?: 'page' | 'char' | 'word';
};

const createTextBox = (
    scene: ChangeMapScene,
    x: number,
    y: number,
    dialog: DialogInteraction,
    config: TextBoxConfig
) => {
    const handleContentValue = (index: number) => {
        if (index >= dialog.content.length) {
            return;
        }

        const contentValue = dialog.content[index];

        if (contentValue.options && contentValue.options.length > 0) {
            const dialog = addDialog(scene, config, x, y, contentValue);
            dialog.layout().modalPromise().then((data) => {
                if ('index' in data) {
                    if (contentValue.options[data.index].action === "close") {
                        dialog.destroy();
                        return;
                    }
                    if (contentValue.options[data.index].next !== undefined) {
                        handleContentValue(Number(contentValue.options[data.index].next));
                    }

                }
            });

            scene.gameCamera.mainCamera.ignore(dialog);
        } else {
            const textBox = addTextBox(scene, config, x, y, contentValue);
            scene.gameCamera.mainCamera.ignore(textBox);

            textBox.start(contentValue.text, 50);

            textBox.on('complete', function () {
                scene.time.delayedCall(3000, () => {
                    textBox.destroy();
                    handleContentValue(index + 1);
                });
            });
        }
    };
    handleContentValue(0);
};

const getBuiltInText = (
    scene: ChangeMapScene,
    wrapWidth: number,
    fixedWidth: number,
    fixedHeight: number
) => {
    return scene.add.text(0, 0, '', {
        fontSize: '20px',
        wordWrap: { width: wrapWidth },
        maxLines: 3,
    }).setFixedSize(fixedWidth, fixedHeight);
};

const getBBcodeText = (
    scene: ChangeMapScene,
    wrapWidth: number,
    fixedWidth: number,
    fixedHeight: number,
    maxLines: number
) => {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth,
        fixedHeight,
        fontSize: '20px',
        wrap: {
            mode: 'word',
            width: wrapWidth,
        },
        maxLines,
    });
};

const getIcon = (
    content: DialogContentValue | undefined,
    scene: ChangeMapScene
) => {
    return content?.icon ? scene.add.image(0, 0, content.icon).
        setSize(100, 100).
        setDepth(500).
        setDisplaySize(100, 100) : scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK);
};

const addTextBox = (scene: ChangeMapScene, config: TextBoxConfig, x: number, y: number, content: DialogContentValue) => {
    const width = GetValue(config, 'width', 0);
    const height = GetValue(config, 'height', 0);
    const wrapWidth = GetValue(config, 'wrapWidth', 0);
    const fixedWidth = GetValue(config, 'fixedWidth', 0);
    const fixedHeight = GetValue(config, 'fixedHeight', 0);
    const typingMode = GetValue(config, 'typingMode', 'page');
    const maxLines = width > 0 ? 0 : 3;

    var icon = getIcon(content, scene);

    const textBox = scene.rexUI.add.textBox({
        x,
        y,
        width,
        height,
        typingMode,
        background: scene.rexUI.add.roundRectangle({
            radius: 20,
            color: COLOR_MAIN,
            strokeColor: COLOR_LIGHT,
            strokeWidth: 2,
        }),
        icon: icon,
        text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight, maxLines),
        expandTextWidth: width > 0,
        expandTextHeight: height > 0,
        action: scene.rexUI.add.aioSpinner({
            width: 30,
            height: 30,
            duration: 1000,
            animationMode: 'ball',
        }).setVisible(false),
        title: content.speaker ? scene.add.text(0, 0, content.speaker, { fontSize: '24px' }) : undefined,
        separator: scene.rexUI.add.roundRectangle({ height: 3, color: COLOR_DARK }),
        space: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
            icon: 10,
            text: 10,
            separator: 6,
        },
        align: {
            title: 'center',
            action: 'bottom',
        },
    })
        .setOrigin(0)
        .layout();

    textBox
        .setInteractive()
        .on('pointerdown', function () {
            if (typingMode === 'page') {
                if (textBox.isTyping) {
                    // If the text is typing, stop it and display the full page
                    textBox.stop(true);
                } else if (!textBox.isLastPage) {
                    // If the text is not typing and there are more pages, go to the next page
                    textBox.typeNextPage();
                } else {
                    // If it's the last page, destroy the textBox
                    textBox.destroy();
                }
            }
        }, textBox)
        .on('pageend', function () {
            if (textBox.isLastPage)
                scene.tweens.add({
                    targets: [textBox],
                    alpha: 1,
                    duration: 500,
                    delay: 3000
                });
            return;
        }, textBox);
    return textBox;
}

const addDialog = (scene: ChangeMapScene, config: TextBoxConfig, x: number, y: number, content: DialogContentValue) => {
    const width = GetValue(config, 'width', 0);
    const height = GetValue(config, 'height', 0);

    var style = {
        x: x + width / 2,
        y: y + height / 2,
        width,
        height,
        background: {
            color: COLOR_MAIN,
            strokeColor: COLOR_LIGHT,
            strokeWidth: 1,
            radius: 20,

        },
        title: {
            space: { left: 5, right: 5, top: 5, bottom: 5 },
            text: {
                fontSize: 24
            },
            background: {
                color: COLOR_DARK
            },
            radius: 20
        },
        content: {
            space: { left: 5, right: 5, top: 5, bottom: 5 },
            text: {
                fontSize: 20
            },
        },

        button: {
            space: { left: 10, right: 10, top: 10, bottom: 10 },
            background: {
                color: COLOR_DARK,
                strokeColor: COLOR_LIGHT,
                radius: 0,

                'hover.strokeColor': 0xffffff,
                'hover.radius': 15,
            }
        },

        modal: {
            cover: { color: COLOR_LIGHT, alpha: 0.3 }
        },
        space: { left: 20, right: 20, top: 20, bottom: 20, title: 20, content: 30, action: 15, },
    }

    const dialog = scene.rexUI.add.confirmDialog(style)
        .resetDisplayContent({
            title: content.speaker,
            content: content.text,
            buttonA: content.options[0].text,
            buttonB: content.options[1].text,
        })
        .layout();

    return dialog;
}

export { createTextBox, getBuiltInText, getBBcodeText };
