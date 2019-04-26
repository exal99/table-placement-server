class Chair {
    constructor(size, name) {
        this.x = 0;
        this.y = 0;
        this.size = size;
        this.selected = false;
        this.name = (name === undefined) ? '' : name;
    }

    draw() {
        
        rect(this.x, this.y, this.size, this.size);
        text(this.name, this.x, this.y, this.x + this.size, this.y + this.size);
    }

    updateName(newName) {
        this.name = name;
    }

    updatePos(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    isInside(mouseX, mouseY) {
        return this.x < mouseX && mouseX < this.x + this.size &&
               this.y < mouseY && mouseY < this.y + this.size;
    }

    toJSON() {
        return this.name;
    }
    
}