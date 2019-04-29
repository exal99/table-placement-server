class Chair {
    constructor(pos, size, name) {
        this.x = pos.x;
        this.y = pos.y;
        this.size = size;
        this.selected = false;
        this.mouseOver = false;
        this.name = (name === undefined) ? '' : name;
        const input = document.createElement('div');
        input.contentEditable = true;
        //input.type = "text";
        input.className = "chair-input";
        input.style.width = `${size}px`;
        input.style.height = `${size}px`;
        input.style.top = `${pos.y}px`;
        input.style.left = `${pos.x}px`;
        this.input = input;
        document.getElementById('sketch-holder').appendChild(input);
    }

    update() {
        const translate = `translate(${translateVector.x + currentTranslate.x}px, ${translateVector.y + currentTranslate.y}px)`;
        const scale = `scale(${zoomAmount}, ${zoomAmount})`;
        //this.input.style.transform = translate;
        this.input.style.width = this.size * zoomAmount + "px";
        this.input.style.height = this.size * zoomAmount + "px";
        //this.input.style.transform += scale;
        //this.input.style.transform = scale + " " + translate + ";";//translate + " " + scale + ";";
        this.input.style.top = `${(this.y+translateVector.y+currentTranslate.y)*zoomAmount}px`;
        this.input.style.left = `${(this.x+translateVector.x+currentTranslate.x)*zoomAmount}px`;
    }

    draw() {
        push();
        strokeWeight(5);
        if (this.selected) {
            stroke(color(CHAIR_BORDER_SELECTED));
            fill(color(CHAIR_SELECTED));
        } else if (this.mouseOver){
            stroke(color(CHAIR_BORDER_HIGHLIGHT));
            fill(color(CHAIR_HIGHLIGHT));
        } else {
            stroke(color(CHAIR_BORDER));
            fill(color(CHAIR_COLOR));
        }
        //rect(this.x, this.y, this.size, this.size);
        
        const x = this.x + this.size / 2;
        const y = this.y + this.size / 2;

        const textBoxPercent = 0.9;
        
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(18);
        strokeWeight(0);
        //text(this.name, x, y, this.size * textBoxPercent, this.size * textBoxPercent);
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