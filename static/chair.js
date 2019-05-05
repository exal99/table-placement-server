class Chair {
    constructor(size, name) {
        this.x = 0;
        this.y = 0;
        this.size = size;
        this.selected = false;
        this.mouseOver = false;
        this.name = (name === undefined) ? '' : name;
    }

    draw() {
        push();
        strokeWeight(5);
        if (this.selected) {
            //stroke(244, 170, 66);
            stroke(color(CHAIR_BORDER_SELECTED));
            fill(color(CHAIR_SELECTED));
        } else if (this.mouseOver){
            //stroke(252, 210, 151);
            stroke(color(CHAIR_BORDER_HIGHLIGHT));
            fill(color(CHAIR_HIGHLIGHT));
        } else {
            //stroke(0);
            stroke(color(CHAIR_BORDER));
            fill(color(CHAIR_COLOR));
        }
        rect(this.x, this.y, this.size, this.size);
        
        const x = this.x + this.size / 2;
        const y = this.y + this.size / 2;

        const textBoxPercent = 0.9;
        
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(18);
        strokeWeight(0);
        text(this.name, x, y, this.size * textBoxPercent, this.size * textBoxPercent);
        rectMode(CORNER);
        pop();
    }

    updatePos(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    isInside(pos) {
        const x = pos.x;
        const y = pos.y;
        return this.x < x && x < this.x + this.size &&
               this.y < y && y < this.y + this.size;
    }

    toJSON() {
        return this.name;
    }
    
}