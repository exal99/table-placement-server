class Chair {
    constructor(top, callback, index, name) {
        const input = document.createElement('div');
        const oppositIndex = (top) ? ((index != chairs.length - 1) ? index + 1 : index) : index - 1;
        input.addEventListener('input', () => {
            chairs[oppositIndex].input.style.width = chairs[oppositIndex].input.style.minWidth = Math.max(this.input.scrollWidth, 150) + "px";
            callback();
        });
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