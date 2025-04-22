export class DialogContentOptionValue {

    text: string;
    next: number | undefined;
    action: string | undefined;

    constructor(text: string, next: number | undefined, action: string | undefined) {
        this.text = text;
        this.next = next;
        this.action = action;
    }
}