function createVector(x, y) {
    return new Vector(x, y);
}

class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(x, y, z) {
        if (x instanceof Vector) {
          this.x += x.x || 0;
          this.y += x.y || 0;
          this.z += x.z || 0;
          return this;
        }
        if (x instanceof Array) {
          this.x += x[0] || 0;
          this.y += x[1] || 0;
          this.z += x[2] || 0;
          return this;
        }
        this.x += x || 0;
        this.y += y || 0;
        this.z += z || 0;
        return this;
    }
    
    sub(x, y, z) {
        if (x instanceof Vector) {
          this.x -= x.x || 0;
          this.y -= x.y || 0;
          this.z -= x.z || 0;
          return this;
        }
        if (x instanceof Array) {
          this.x -= x[0] || 0;
          this.y -= x[1] || 0;
          this.z -= x[2] || 0;
          return this;
        }
        this.x -= x || 0;
        this.y -= y || 0;
        this.z -= z || 0;
        return this;
    }

    mult(n) {
        if (!(typeof n === 'number' && isFinite(n))) {
          console.warn(
            'Vector.mult:',
            'n is undefined or not a finite number'
          );
          return this;
        }
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }

    div(n) {
        if (!(typeof n === 'number' && isFinite(n))) {
          console.warn(
            'Vector.div:',
            'n is undefined or not a finite number'
          );
          return this;
        }
        if (n === 0) {
          console.warn('Vector.div:', 'divide by 0');
          return this;
        }
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    }

    mag() {
        return Math.sqrt(this.magSq());
    }

    magSq() {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        return x * x + y * y + z * z;
    }

    dot(x, y, z) {
        if (x instanceof Vector) {
          return this.dot(x.x, x.y, x.z);
        }
        return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
    }

    cross(v) {
        const x = this.y * v.z - this.z * v.y;
        const y = this.z * v.x - this.x * v.z;
        const z = this.x * v.y - this.y * v.x;
        return new Vector(x, y, z);
    }

    dist(v) {
        return v
          .copy()
          .sub(this)
          .mag();
    }

    normalize() {
        const len = this.mag();
        // here we multiply by the reciprocal instead of calling 'div()'
        // since div duplicates this zero check.
        if (len !== 0) this.mult(1 / len);
        return this;
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    rotate(a) {
        let newHeading = this.heading() + a;
        const mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    }

    angleBetween(v) {
        const dotmagmag = this.dot(v) / (this.mag() * v.mag());
        // Mathematically speaking: the dotmagmag variable will be between -1 and 1
        // inclusive. Practically though it could be slightly outside this range due
        // to floating-point rounding issues. This can make Math.acos return NaN.
        //
        // Solution: we'll clamp the value to the -1,1 range
        let angle;
        angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
        angle = angle * Math.sign(this.cross(v).z || 1);
        return angle;
    }

    array() {
        return [this.x || 0, this.y || 0, this.z || 0];
    }

    equals(x, y, z) {
        let a, b, c;
        if (x instanceof Vector) {
          a = x.x || 0;
          b = x.y || 0;
          c = x.z || 0;
        } else if (x instanceof Array) {
          a = x[0] || 0;
          b = x[1] || 0;
          c = x[2] || 0;
        } else {
          a = x || 0;
          b = y || 0;
          c = z || 0;
        }
        return this.x === a && this.y === b && this.z === c;
    }

    equals(x, y, z) {
        let a, b, c;
        if (x instanceof Vector) {
          a = x.x || 0;
          b = x.y || 0;
          c = x.z || 0;
        } else if (x instanceof Array) {
          a = x[0] || 0;
          b = x[1] || 0;
          c = x[2] || 0;
        } else {
          a = x || 0;
          b = y || 0;
          c = z || 0;
        }
        return this.x === a && this.y === b && this.z === c;
    }
}