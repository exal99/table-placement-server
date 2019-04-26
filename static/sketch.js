const chairSize = 50;
const padding = 5;
const sencetivity = 0.005;

let numChairs = 10;

let lastPress;
let translateVector;
let currentTranslate;

let zoomLocation;
let zoomAmount = 1.0;

let chairs = [];

let cnv;

function makeInputBar() {

    const div1 = createDiv('Number of chairs:').parent("menu_bar").addClass("menu_item");
    const div2 = createDiv('Prodject name:').parent("menu_bar").addClass("menu_item");

    const button = createButton("Update prodject");
    button.elt.addEventListener('click', (event) => {
            const val = parseInt(document.getElementById('n-chairs').value);
            if (!isNaN(val)) {
                numChairs = val;
                updateNumChairs();
            }
    });

    createInput().parent(div2).value('test').id('p-name').elt.addEventListener("keyup", (event) => {
        if (event.keyCode == 13) {
            event.preventDefault();
            button.elt.click();
        }
    });
    button.parent(div2);

    createInput().parent(div1).value(numChairs).id('n-chairs').elt.addEventListener("keyup", (event) => {
        if (event.keyCode == 13) {
            event.preventDefault();
            button.elt.click();
        }
    });    
}


function getWidth() {
    return windowWidth;
}

function getHeight() {
    return windowHeight;
}

function getCanvasPos() {
    x = (windowWidth - width) / 2;
    y = (windowHeight - height) / 2;
    return {'x': x, 'y': y};
}

function tableWidth(chairs) {
    return chairs * chairSize + padding * (chairs + 1);
}
    
function setup() {
    lastPress = createVector(0,0);
    cnv = createCanvas(getWidth(), getHeight()).parent('sketch-holder');
    const pos = getCanvasPos();
    cnv.position(pos.x, pos.y);
    translateVector = createVector(0,0);
    currentTranslate = createVector(0,0);
        
    zoomLocation = createVector(0,0);
        
    makeInputBar();
    for (let i = 0; i < numChairs; i++) {
        chairs.push(new Chair(chairSize, "test"));
    }
    updateChairsPos();
    
}
    
function draw() {
    background(49,193,198);
    scale(zoomAmount);
    translate(translateVector.x + currentTranslate.x, translateVector.y + currentTranslate.y);
            
    chairs.forEach((chair) => {
        chair.draw();
    });
    const tBox = getTableBox();
    rect(tBox.x, tBox.y, tBox.width, tBox.height);
}

function getTableBox() {
    const tWidth = tableWidth(ceil(numChairs/2));
    const tHeight = 50;
    const tableX = width/2 - tWidth/2;
    const tableY = height/2 - tHeight/2;

    return {"width": tWidth, "height": tHeight, "x": tableX, "y": tableY};
}

function updateNumChairs() {
    const toAdd = numChairs - chairs.length;

    if (toAdd < 0) {
        chairs.splice(chairs.length + toAdd);
    } else {
        for (let i = 0; i < toAdd; i++) {
            chairs.push(new Chair(chairSize));
        }
    }

    updateChairsPos();
}

function updateChairsPos() {

    let top = true;

    const tableBox = getTableBox();
        
    //for (let x = tableX + padding; x < tableX + tWidth; x += padding + chairSize) {
    for (let i = 0; i < chairs.length; i++) {
        const x = tableBox.x + padding + Math.floor(i/2) * (padding + chairSize); 
        chairs[i].updatePos(x, (top) ? tableBox.y - padding - chairSize : tableBox.y + padding + tableBox.height);
        top = !top;
    }        
}
            
function mouseWheel(event) {
    const mousePos = createVector(mouseX, mouseY).mult(1/zoomAmount).sub(translateVector);
    zoomAmount += -event.delta * sencetivity;
    if (zoomAmount < 0.7) {
        zoomAmount = 0.7;
    }
    const newPos = createVector(mouseX, mouseY).mult(1/zoomAmount).sub(translateVector);
    translateVector.add(p5.Vector.sub(newPos, mousePos));
                            
                            
}
                        
function mouseReleased() {
    translateVector.add(currentTranslate);
    currentTranslate.x = 0;
    currentTranslate.y = 0;
}

function mouseDragged() {
    currentTranslate = createVector(mouseX, mouseY).sub(lastPress).mult(1/zoomAmount);
}
                                
function mousePressed() {
    lastPress = createVector(mouseX, mouseY);
}
    
function keyPressed() {
    if (key == 'R') {
        translateVector.x = 0;
        translateVector.y = 0;
        zoomAmount = 1;
    }
}

function windowResized() {
    resizeCanvas(getWidth(), getHeight());
    const pos = getCanvasPos();
    cnv.position(pos.x, pos.y);
}