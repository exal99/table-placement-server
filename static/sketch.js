const chairSize = 50;
const padding = 5;
const sencetivity = 0.005;

let numChairs = 10;

let lastPress;
let translateVector;
let currentTranslate;

let zoomLocation;
let zoomAmount = 1.0;

let sock;

let chairsInput;

function makeInputBar() {
    //textAlign(CENTER);
    let numChairsText = createElement('h2', 'Number of chairs');
    numChairsText.position(width/2, numChairsText.height + 30);
        
    chairsInput = createInput();
    chairsInput.position(width/2, 2*(numChairsText.height + 30));
    chairsInput.value(numChairs);
                
                
    let button = createButton('summit');
    button.position(chairsInput.x + chairsInput.widht,2*(numChairsText.height + 30));
        
    print(chairsInput.x + " " + chairsInput.width);
        
    button.mousePressed( () => {
        numChairs = parseInt(chairsInput.value());
    });
    
}


function getWidth() {
    return windowWidth * 0.8;
}

function getHeight() {
    return windowHeight * 0.8;
}

function tableWidth(chairs) {
    return chairs * chairSize + padding * (chairs + 1);
}
    
function setup() {
    lastPress = createVector(0,0);
    createCanvas(getWidth(), getHeight());
    translateVector = createVector(0,0);
    currentTranslate = createVector(0,0);
        
    zoomLocation = createVector(0,0);
            
    sock = new WebSocket("ws://localhost:1234/chat");
    sock.onopen = function (event) {
        sock.send("Hello");
    }
    
    sock.onmessage = function (event) {
        print(event.data);
    }
        
    makeInputBar();
}
    
function draw() {
    background(49,193,198);
    scale(zoomAmount);
    translate(translateVector.x + currentTranslate.x, translateVector.y + currentTranslate.y);
            
    drawTable();
}

function drawTable() {
    const tWidth = tableWidth(ceil(numChairs/2));
    const tHeight = 50;
    const tableX = width/2 - tWidth/2;
    const tableY = height/2 - tHeight/2;
    
    rect(tableX, tableY, tWidth, tHeight);
    
    let drawn = 0;
        
    for (let x = tableX + padding; x < tableX + tWidth; x += padding + chairSize) {
        rect(x, tableY - padding - chairSize, chairSize, chairSize);
        drawn++;
        if (drawn < numChairs) {
            rect(x, tableY + padding + tHeight, chairSize, chairSize);
            drawn++;
        }
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
}