export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vect) {
        return new Vector(this.x + vect.x, this.y + vect.y);
    }

    mult(num) {
        return new Vector(this.x * num, this.y * num);
    }

    sub(vect) {
        return this.add(vect.mult(-1));
    }
}