class ConfermWindow {
    constructor(text, callback, confermButton, cancelButton) {
        this.text = text;
        this.confermButton = (confermButton === undefined) ? "OK" : confermButton;
        this.cancelButton = (cancelButton === undefined) ? "Cancel" : cancelButton;
        this.callback = callback;
    }

    draw() {
        push();
        rectMode(CENTER);
        textAlign(CENTER, CENTER);

        const boxWidth = 500;
        const boxHeight = 200;
        const textWidth = 0.95;
        const textHeight = 0.95;

        
        rect(width/2, height/2 + boxHeight/2+50, boxWidth, 100);
        fill(66, 134, 244);
        rect(width/2, height/2, boxWidth, boxHeight);
        textSize(50);
        fill(255);
        text(this.text, width/2, height/2, boxWidth * textWidth, boxHeight * textHeight);
        
        
        pop();
    }
}