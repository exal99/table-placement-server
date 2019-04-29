const chairSize = 150;
const tableHeight = 130;
const padding = 20;
const sencetivity = 1.05;

const BACKGROUND_COLOR = '#00a8ff'
const TABLE_COLOR = '#dcdde1'

const CHAIR_COLOR = '#353b48';
const CHAIR_HIGHLIGHT = '#718093';
const CHAIR_SELECTED = '#7f8fa6';
const CHAIR_BORDER = '#7f7fa6';
const CHAIR_BORDER_HIGHLIGHT = '#e1b12c';
const CHAIR_BORDER_SELECTED = '#fbc531';

let table;
let tablePos

let numChairs = 10;

let lastPress;
let translateVector;
let currentTranslate;

let zoomLocation;
let zoomAmount = 0.7;

let chairs = [];
let selectedChair = null;

let backspacePressedTime = 0;

let cnv;

let socket;
let projectName = null;

let uuid;

function makeInputBar() {
    const button = document.getElementById('update');
    button.addEventListener('click', (event) => {
        const val = parseInt(document.getElementById('n-chairs').value);
        if (!isNaN(val)) {
            numChairs = val;
            updateNumChairs();
            updateProject();
        }
        
        const newName = document.getElementById('p-name').value;
        if (newName !== "") {
            leaveProject();
            window.history.pushState("Something", "", "/project/" + newName);
            projectName = newName;
            joinProject();
        } else {
            leaveProject();
            window.history.pushState("Something", "", "/");
            projectName = null;
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

function getData() {
    return {
        project:projectName,
        uuid: uuid,
        data: {
            numChairs: numChairs,
            chairs: chairs
        }
    };
}

function joinProject() {
    socket.emit('join', {project: projectName});
}

function updateProject() {
    if (projectName !== null) {
        socket.emit('update', getData());
    }
}

function leaveProject() {
    if (projectName !== null)
        socket.emit('leave', {project: projectName});
}

function updateTable() {
    const origin = getTableBox();
    table.style.width = origin.width * zoomAmount + "px";
    table.style.height = origin.height * zoomAmount + "px";
    table.style.left = (origin.x + currentTranslate.x + translateVector.x) * zoomAmount + "px";
    table.style.top  = (origin.y + currentTranslate.y + translateVector.y) * zoomAmount + "px";
    //this.input.style.top = `${this.y*zoomAmount}px`;
    //this.input.style.left = `${this.x*zoomAmount}px`;
}
    
function setup() {
    textFont('Work Sans');
    //lastPress = createVector(0,0);
    lastPress = null;
    cnv = createCanvas(getWidth(), getHeight()).parent('sketch-holder');
    cnv.elt.style.width  = "100%";
    cnv.elt.style.height = "100%";

    translateVector = createVector(0,0);
    currentTranslate = createVector(0,0);
        
    zoomLocation = createVector(0,0);
        
    makeInputBar();
    table = document.getElementById('table-box');
    const tableBox = getTableBox();

    table.style.width = `${tableBox.width}px`;
    table.style.height = `${tableBox.height}px`;
    table.style.top = `${tableBox.y}px`;
    table.style.left = `${tableBox.x}px`;

    updateTable();

    frameRate(60);
    if (location.pathname.startsWith("/project/")) {
        projectName = decodeURIComponent(location.pathname.slice(9));
    } else {
        for (let i = 0; i < numChairs; i++) {
            chairs.push(new Chair(getChairPos(i), chairSize, ""));
            chairs[i].update();
        }
        updateChairsPos();
    }
    
    socket = io.connect(location.protocol + '//' + document.domain + ":" + location.port);
    
    socket.on('acc', (acc) => {
        print(acc);
    });

    socket.on('update', (data) => {
        if (data['uuid'] !== uuid) {
            numChairs = data['numChairs'];
            document.getElementById('n-chairs').value = data['numChairs'];
            updateNumChairs();
            for (let i = 0; i < numChairs; i++) {
                chairs[i].name = data['chairs'][i];
            }
        }
    });

    socket.on('connected', (server_uuid) => {
        uuid = server_uuid;
    });

    socket.on('connect', () => {
        if (location.pathname.startsWith("/project/") && location.pathname.length > 9) {
            joinProject();
        }
    });
}
    
function draw() {
    background(color(BACKGROUND_COLOR));
    push();
    //scale(zoomAmount);
    //translate(translateVector.x + currentTranslate.x, translateVector.y + currentTranslate.y);
            
    chairs.forEach((chair) => {
        if (chair.isInside(getAcctualMousePos())) {
            chair.mouseOver = true;
        } else {
            chair.mouseOver = false;
        }
        chair.draw();
    });
    const tBox = getTableBox();
    strokeWeight(5);
    //fill(TABLE_COLOR);
    //rect(tBox.x, tBox.y, tBox.width, tBox.height);
    pop();

    if (keyIsDown(BACKSPACE) && millis() - backspacePressedTime > 400 && selectedChair !== null) {
        selectedChair.name = selectedChair.name.slice(0, selectedChair.name.length - 1);
        updateProject();
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
    document.getElementById('n-chairs').value = numChairs;
    document.getElementById('p-name').value = projectName;
}

function getTableBox() {
    const tWidth = tableWidth(ceil(numChairs/2));
    const tableX = width/2 - tWidth/2; //1/0.7*width/2 - tWidth/2;
    const tableY = height/2 - tableHeight/2; //1/0.7*height/2 - tableHeight/2;

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

function getChairPos(index) {
    const tableBox = getTableBox();
    const x = tableBox.x + padding + Math.floor(index/2) * (padding + chairSize);
    const y = (index % 2 == 0) ? tableBox.y - padding - chairSize : tableBox.y + padding + tableBox.height;
    return createVector(x,y);
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
    zoomAmount = max(zoomAmount, 0.3);
    const newPos = createVector(mouseX, mouseY).mult(1/zoomAmount).sub(translateVector);
    translateVector.add(p5.Vector.sub(newPos, mousePos));
    updateTable();
    chairs.forEach((chair) => {chair.update()});
}
                        
function mouseReleased() {
    translateVector.add(currentTranslate);
    currentTranslate.x = 0;
    currentTranslate.y = 0;
    lastPress = null;
    updateTable();
    chairs.forEach((chair) => {chair.update()});
}

function mouseDragged() {
    if (0 <= mouseX && mouseX <= width && 0 <= mouseY && mouseY <= height && lastPress !== null) {
        currentTranslate = createVector(mouseX, mouseY).sub(lastPress).mult(1/zoomAmount);
        updateTable();
        chairs.forEach((chair) => {chair.update()});
    }
}
                                
function mousePressed() {
    if (0 <= mouseX && mouseX <= width && 0 <= mouseY && mouseY <= height)
        lastPress = createVector(mouseX, mouseY)
}
    
function keyPressed() {
    if (selectedChair !== null) {
        if (keyCode === BACKSPACE) {
            selectedChair.name = selectedChair.name.slice(0, selectedChair.name.length - 1);
            backspacePressedTime = millis();
            updateProject();
        }
        
        if (keyCode === DELETE) {
            selectedChair.name = "";
            updateProject();
        }
    }
}

function keyTyped() {
    if (selectedChair !== null) {
        selectedChair.name += key;
        updateProject();
    }
}

function windowResized() {
    resizeCanvas(getWidth(), getHeight());
    cnv.elt.style.width  = "100%";
    cnv.elt.style.height = "100%";
    //const pos = getCanvasPos();
    //cnv.position(pos.x, pos.y);

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