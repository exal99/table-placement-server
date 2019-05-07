const sencetivity = 1.02;

let tableDiv;
let scaleDiv;

let numChairs = 0;

let translateVector;

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
    
function setup() {
    lastPress = null;
    cnv = createCanvas(getWidth(), getHeight()).parent('sketch-holder');
    cnv.elt.style.width  = "100%";
    cnv.elt.style.height = "100%";

    translateVector = createVector(0,0);

    makeInputBar();
    tableDiv = document.getElementById('table-div');
    scaleDiv = document.getElementById('scale-div');

    function dragMoveListener(event) {
        translateVector.add(event.dx, event.dy);
        const {x, y} = translateVector;
        tableDiv.style.transform = `translate(${x}px, ${y}px)`;
    }

    interact("#table-box")
        .draggable({
            inertia: true,

            //autoScroll: true,

            modifiers: [
                interact.modifiers.restrict({
                    restriction: "#sketch-holder",
                    endOnly: true,
                    elementRect: {top: 0, left: 0.9, bottom: 1, right: 0.1}
                }),
            ],

            onmove: dragMoveListener
        })
        .gesturable({
            onmove: function (event) {
                const currentZoom = zoomAmount * event.scale;
                scaleDiv.style.transform = `scale(${currentZoom}, ${currentZoom})`;
                dragMoveListener(event);
            },

            onend: function (event) {
                zoomAmount *= event.scale;
            }
        });

    interact("#sketch-holder")
        .gesturable({
                onmove: function (event) {
                    const currentZoom = Math.max(zoomAmount * event.scale, 0.3);
                    scaleDiv.style.transform = `scale(${currentZoom}, ${currentZoom})`;
                    dragMoveListener(event);
                },

                onend: function (event) {
                    zoomAmount = Math.max(zoomAmount * event.scale, 0.3);
                }
        });
        
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

    noLoop();
}

function getOrigin(tWidth, tHeight, startZoom) {
    return createVector(width/(2) - tWidth/2, height/(2) - tHeight/2)
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
    const {x, y} = translateVector;
    tableDiv.style.transform = `translate(${x}px, ${y}px)`;
    scaleDiv.style.transform = `scale(${zoomAmount}, ${zoomAmount})`;
}


function mouseClicked() {
    document.getElementById('n-chairs').value = numChairs;
    document.getElementById('p-name').value = projectName;
}


function getAcctualMousePos() {
    return createVector(mouseX, mouseY).mult(1/zoomAmount).sub(translateVector);
}
            
function mouseWheel(event) {
    zoomAmount *= (event.delta < 0) ? sencetivity : 1/sencetivity;
    zoomAmount = max(zoomAmount, 0.3);
    updateTable();
}

function windowResized() {
    resizeCanvas(getWidth(), getHeight());
    cnv.elt.style.width  = "100%";
    cnv.elt.style.height = "100%";

}

function keyPressed() {
    if (document.activeElement.className === 'chair-input' && keyIsDown(CONTROL) && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
        move(document.activeElement.index, (keyCode === LEFT_ARROW) ? -1 : 1);
        return false;
    }
}

function move(index, direction) {
    if (chairs[index].getName === "") {
        return;
    }
    const offset = 2 * direction;
    let end = index;
    do {
        if (end + offset >= chairs.length || end + offset < 0)
            return;
        end += offset;
    } while (chairs[end].getName() !== "");
    
    for (let i = end; i != index; i -= offset) {
        chairs[i].setName(chairs[i - offset].getName());
        chairs[i].input.oninput();
    }
    chairs[index].setName("");
    
    chairs[index].input.oninput();

    chairs[index + offset].input.focus();
    document.execCommand("selectAll", false, null);
    
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