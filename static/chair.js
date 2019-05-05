class Chair {
    constructor(top, callback, name) {
        const input = document.createElement('div');
        input.addEventListener('input', callback);
        input.contentEditable = true;

        input.className = "chair-input";
        input.textContent = (name === undefined) ? "" : name;
        this.input = input;
        if (top) {
            document.getElementById('chairs-above').appendChild(input);
        } else {
            document.getElementById('chairs-below').appendChild(input);
        }
    }

    setName(newName) {
        this.input.textContent = newName;
    }

    remove() {
        this.input.parentElement.removeChild(this.input);
    }

    toJSON() {
        return this.input.textContent;
    }
    
}