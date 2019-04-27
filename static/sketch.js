const chairSize = 100;
const tableHeight = 100;
const padding = 5;
const sencetivity = 1.05;

let numChairs = 10;

let lastPress;
let translateVector;
let currentTranslate;

let zoomLocation;
let zoomAmount = 1.0;

let chairs = [];
let selectedChair = null;

let backspacePressedTime = 0;

let cnv;

function makeInputBar() {
    const button = document.getElementById('update');
    button.addEventListener('click', (event) => {
            const val = parseInt(document.getElementById('n-chairs').value);
            if (!isNaN(val)) {
                numChairs = val;
                updateNumChairs();
                window.history.pushState("Something", "", "/project/" + document.getElementById('p-name').value)
            }
    });

    document.getElementById('p-name').addEventListener("keyup", (event) => {
        if (event.keyCode == 13) {
            event.preventDefault();
            button.click();
        }
    });
    document.getElementById('n-chairs').value = numChairs;
    document.getElementById('n-chairs').addEventListener("keyup", (event) => {
        if (event.keyCode == 13) {
            event.preventDefault();
            button.click();
        }
    });  
}


function getWidth() {
    return windowWidth * 1;
}

function getHeight() {
    return windowHeight * 1;
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
    cnv.elt.style.width  = "100%";
    cnv.elt.style.height = "100%";
    const pos = getCanvasPos();
    cnv.position(pos.x, pos.y);
    translateVector = createVector(0,0);
    currentTranslate = createVector(0,0);
        
    zoomLocation = createVector(0,0);
        
    makeInputBar();
    for (let i = 0; i < numChairs; i++) {
        chairs.push(new Chair(chairSize, "Alexander Simko N16E"));
    }
    updateChairsPos();

    frameRate(60);
}
    
function draw() {
    background(49,193,198);
    push();
    scale(zoomAmount);
    translate(translateVector.x + currentTranslate.x, translateVector.y + currentTranslate.y);
            
    chairs.forEach((chair) => {
        if (chair.isInside(getAcctualMousePos())) {
            chair.mouseOver = true;
        } else {
            chair.mouseOver = false;
        }
        chair.draw();
    });
    const tBox = getTableBox();
    rect(tBox.x, tBox.y, tBox.width, tBox.height);
    pop();

    if (keyIsDown(BACKSPACE) && millis() - backspacePressedTime > 400 && selectedChair !== null) {
        selectedChair.name = selectedChair.name.slice(0, selectedChair.name.length - 1);
    }
    
}

function mouseClicked() {
    chairs.forEach((chair) => {
        if (chair.isInside(getAcctualMousePos())) {
            chair.selected = true;
            selectedChair = chair;
        } else {
            selectedChair = (chair === selectedChair) ? null : selectedChair;
            chair.selected = false;
        }
    });
}

function getTableBox() {
    const tWidth = tableWidth(ceil(numChairs/2));
    const tableX = width/2 - tWidth/2;
    const tableY = height/2 - tableHeight/2;

    return {"width": tWidth, "height": tableHeight, "x": tableX, "y": tableY};
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
    
    for (let i = 0; i < chairs.length; i++) {
        const x = tableBox.x + padding + Math.floor(i/2) * (padding + chairSize);
        chairs[i].updatePos(x, (top) ? tableBox.y - padding - chairSize : tableBox.y + padding + tableBox.height);
        top = !top;
    }        
}

function getAcctualMousePos() {
    return createVector(mouseX, mouseY).mult(1/zoomAmount).sub(p5.Vector.add(translateVector, currentTranslate));
}
            
function mouseWheel(event) {
    const mousePos = getAcctualMousePos();
    zoomAmount *= (event.delta < 0) ? sencetivity : 1/sencetivity;
    zoomAmount = max(zoomAmount, 0.5);
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
    if (selectedChair !== null) {
        if (keyCode === BACKSPACE) {
            selectedChair.name = selectedChair.name.slice(0, selectedChair.name.length - 1);
            backspacePressedTime = millis();
        }
        
        if (keyCode === DELETE) {
            selectedChair.name = "";
        }
    }
}

function keyTyped() {
    if (selectedChair !== null) {
        selectedChair.name += key;
    }
}

function windowResized() {
    resizeCanvas(getWidth(), getHeight());
    cnv.elt.style.width  = "100%";
    cnv.elt.style.height = "100%";
    const pos = getCanvasPos();
    cnv.position(pos.x, pos.y);

    updateChairsPos();
}

function showConfirmBox(text, callback) {
    const window = document.getElementById("confirm");
    window.style.display = "block";
    document.getElementById("confirm-text").innerHTML = `<p>${text}</p>`;
    const buttons = document.getElementById("confirm-button").children;

    let okEventListener, cancelEventListener, windowClick;

    let cleanUp = () => {
        window.style.display = "none";
        buttons[0].removeEventListener('click', okEventListener);
        buttons[1].removeEventListener('click', cancelEventListener);
        document.body.removeEventListener('click', cancelEventListener);
        window.removeEventListener('click', windowClick);
    }

    okEventListener = (event) => {
        callback(true);
        cleanUp();
        
    };

    cancelEventListener = (event) => {
        callback(false);
        cleanUp();
    };

    windowClick = (event) => {
        event.stopPropagation();
    };
    
    buttons[0].addEventListener('click', okEventListener);
    buttons[1].addEventListener('click', cancelEventListener);
    document.body.addEventListener('click', cancelEventListener);
    window.addEventListener('click', windowClick);
}