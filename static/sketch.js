const sencetivity = 1.02;

const BACKGROUND_COLOR = '#00a8ff'

let tableDiv;

let numChairs = 0;

let lastPress;
let translateVector;
let currentTranslate;

let zoomLocation;
let zoomAmount = 0.7;

let chairs = [];
let chairsAboveElement;
let chairsBelowElement;

let cnv;

let socket;
let projectName = null;

let uuid;

function makeInputBar() {
    const button = document.getElementById('update');
    button.addEventListener('click', (event) => {
        const val = parseInt(document.getElementById('n-chairs').value);
        if (!isNaN(val) && val != numChairs && val > 0) {
            numChairs = val;
            updateNumChairs();
            updateProject();
        }
        
        const newName = document.getElementById('p-name').value;
        if (newName !== "" && newName != projectName) {
            leaveProject();
            window.history.pushState("Something", "", "/project/" + newName);
            projectName = newName;
            joinProject();
        } else if (newName != projectName){
            leaveProject();
            window.history.pushState("Something", "", "/");
            projectName = null;
        }   
    });

    document.getElementById('p-name').addEventListener("keyup", (event) => {
        if (event.keyCode == 13) { // keyCode == 13 <==> ENTER
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

function mouseDownHandeler(event) {
    lastPress = createVector(mouseX, mouseY);

    function mouseMoveHandeler(event) {
        currentTranslate = createVector(mouseX, mouseY).sub(lastPress).mult(1/zoomAmount);
        updateTable();
    }

    tableDiv.addEventListener('mousemove', mouseMoveHandeler);

    tableDiv.addEventListener('mouseup', (event) => {
        tableDiv.removeEventListener('mousemove', mouseMoveHandeler);
        translateVector.add(currentTranslate);
        currentTranslate.x = 0;
        currentTranslate.y = 0;
        lastPress = null;
        updateTable();
    });
}
    
function setup() {
    textFont('Work Sans');
    lastPress = null;
    cnv = createCanvas(getWidth(), getHeight()).parent('sketch-holder');
    cnv.elt.style.width  = "100%";
    cnv.elt.style.height = "100%";

    translateVector = createVector(0,0);
    currentTranslate = createVector(0,0);
        
    zoomLocation = createVector(0,0);
        
    makeInputBar();
    tableDiv = document.getElementById('table-div');

    document.getElementById('table-box').onmousedown = mouseDownHandeler;

    chairsAboveElement = document.getElementById('chairs-above');
    chairsBelowElement = document.getElementById('chairs-below');

    frameRate(60);
    if (location.pathname.startsWith("/project/")) {
        projectName = decodeURIComponent(location.pathname.slice(9));
    } else {
        numChairs = 10;
        document.getElementById('n-chairs').value = 10;
        for (let i = 0; i < numChairs; i++) {
            chairs.push(new Chair(i%2 === 0, updateProject, i));
        }

        const tableWidth = tableDiv.scrollWidth;
        const tableHeight = tableDiv.scrollHeight;

        translateVector = getOrigin(tableWidth, tableHeight, zoomAmount);
        updateTable();
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
                chairs[i].setName(data['chairs'][i]);
            }

            if (data['uuid'] === 'server') {
                const tableWidth = tableDiv.scrollWidth;
                const tableHeight = tableDiv.scrollHeight;
        
                translateVector = getOrigin(tableWidth, tableHeight, zoomAmount);
                updateTable();
            }
        }
    });

    socket.on('connected', (server_uuid) => {
        uuid = server_uuid;
        if (location.pathname.startsWith("/project/") && location.pathname.length > 9) {
            joinProject();
        }
    });

    socket.on('connect', () => {
        print("connected");
    });
}

function getOrigin(tWidth, tHeight, startZoom) {
    return createVector(width/(2 * startZoom) - tWidth/2, height/(2 * startZoom) - tHeight/2)
}

function updateNumChairs() {
    const toAdd = numChairs - chairs.length;

    if (toAdd < 0) {
        chairs.splice(toAdd).forEach((chair) => chair.remove());
    } else {
        const startIndex = chairs.length;
        for (let i = 0; i < toAdd; i++) {
            chairs.push(new Chair((i + startIndex) % 2 == 0, updateProject, i + startIndex));
        }
    }
}

function updateTable() {
    let {x, y} = p5.Vector.add(translateVector, currentTranslate);
    tableDiv.style.transform = `scale(${zoomAmount}, ${zoomAmount}) translate(${x}px, ${y}px)`;
}
    
function draw() {
    background(color(BACKGROUND_COLOR));    
}

function mouseClicked() {
    document.getElementById('n-chairs').value = numChairs;
    document.getElementById('p-name').value = projectName;
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
}

function windowResized() {
    resizeCanvas(getWidth(), getHeight());
    cnv.elt.style.width  = "100%";
    cnv.elt.style.height = "100%";

    translateVector.sub()
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