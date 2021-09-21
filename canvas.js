
"use strict";
let myCanvas = document.getElementById("myCanvas");
const wasteArr = [], columnArr = [], trashCanArr = [], placesArr = [],
    wasteCol = [], wasteRow = [], introArr = [],
    colors2 = [
        "waste/glass.png", "waste/glass2.png", "waste/glass3.png",
        "waste/metal.png", "waste/metal2.png", "waste/metal3.png",
        "waste/paper.png", "waste/paper2.png", "waste/paper3.png",
        "waste/plastic.png", "waste/plastic2.png", "waste/plastic3.png"
    ],
    pics = [
        "kepek/muanyagkuka2.png", "kepek/papirkuka2.png", "kepek/uvegkuka2.png",
        "kepek/femkuka2.png"
    ];

let canvW
if (window.innerHeight > 900) {
    canvW = 1350;
} else if (window.innerHeight < 720) {
    canvW = 1350 * 8 / 10;
} else {
    canvW = window.innerHeight * 3 / 2;
}

let gameAreaBG, topRow, mouseX, mouseY, visualize, R, G, B, gradient, time,
    canvH = canvW * 65 / 100, startButton, myMenuBG,
    columnW = canvW * 10 / 100, columnH = canvH * 55 / 100,
    wasteSize = canvW * 85 / 1000, green = "#0F9A48", ghostWhite = "#E8E9F3",
    lightGray = "#CECECE", raisinBlack = "#272635", darkGray = "#6D6A75",
    startTime, mySwitch, introTxt, introTxt2, introTxt3, introTxt4, introTxt5;

function startGame() {
    // a menühöz tartozó cuccok
    myMenuBG = new Component(canvW, canvH, lightGray, 0, 0);
    startButton = new Component(350, 70, "kepek/startgame.png",
        canvW / 2 - 175, 350, "picture");
    for (let i = 0; i < 5; i++) {
        introArr.push(new Component("30px", "Arial", green, 100,
            100 + i * 50, "text"))
    }
    introArr[0].text = "Rakj rendet a szelektív hulladékok között!";
    introArr[1].text = "A játék menete:";
    introArr[2].text = " - Kattints az egérrel az egyik hulladékra";
    introArr[3].text = " - A kiválasztott hulladékot helyezd egy üres helyre";
    introArr[4].text = " - Az előző két lépést ismételve rakj rendet a kukákban";

    // a játékhoz tartozó cuccok
    R = 255;
    G = 255;
    B = 255;
    gradient = 1;
    const topRowH = canvH * 15 / 100, topRowW = canvW * 90 / 100,
        picsTmp = pics, colorsTmp = colors2, kukaW = canvW * 25 / 100,
        kukaH = canvH * 8 / 13;
    for (let i = 0; i < 4; i++) {
        wasteCol.push(canvW * (15 + i * 20) / 100 + columnW * 75 / 1000);
    }
    for (let i = 0; i < 3; i++) {
        wasteRow.push(canvH * (41 + i * 15) / 100);
    }
    shuffle(colors2);
    shuffle(pics);
    gameAreaBG = new Component(canvW, canvH, green, 0, 0);
    topRow = new Component(topRowW, topRowH, raisinBlack, canvW * 5 / 100,
        canvH * 15 / 100);
    for (let i = 0; i < 5; i++) {
        placesArr.push(new Component(wasteSize - 2, wasteSize - 2, raisinBlack,
            canvW * (5 + i * 20) / 100 + columnW * 75 / 1000 + 1,
            canvH * 16 / 100 + 1));
    }
    for (let i = 0; i < 4; i++) {
        columnArr.push(new Component(columnW, columnH, raisinBlack,
            canvW * (15 + i * 20) / 100, canvH * 3 / 10 - 1));
        trashCanArr.push(new Component(kukaW, kukaH, picsTmp.pop(),
            canvW * (75 + i * 200) / 1000, canvH * 34 / 100, "picture"));
    }
    for (const trashCan of trashCanArr) {
        switch (trashCan.color) {
            case 'kepek/papirkuka2.png':
                trashCan.wasteColor = 'blue';
                break;
            case 'kepek/uvegkuka2.png':
                trashCan.wasteColor = 'green';
                break;
            case 'kepek/muanyagkuka2.png':
                trashCan.wasteColor = 'yellow';
                break;
            case 'kepek/femkuka2.png':
                trashCan.wasteColor = 'gray';
        }
    }
    for (const col of wasteCol) {
        for (const row of wasteRow) {
            wasteArr.push(new Component(wasteSize, wasteSize, colorsTmp.pop(),
                col, row, "picture"));
            placesArr.push(new Component(wasteSize - 2, wasteSize - 2, raisinBlack,
                col + 1, row + 1));
        }
    }
    for (const waste of wasteArr) {
        if (waste.color == "waste/glass.png" ||
            waste.color == "waste/glass2.png" ||
            waste.color == "waste/glass3.png") {
            waste.wasteColor = "green";
        } else if (waste.color == "waste/metal.png" ||
            waste.color == "waste/metal2.png" ||
            waste.color == "waste/metal3.png") {
            waste.wasteColor = "gray";
        } else if (waste.color == "waste/paper.png" ||
            waste.color == "waste/paper2.png" ||
            waste.color == "waste/paper3.png") {
            waste.wasteColor = "blue";
        } else if (waste.color == "waste/plastic.png" ||
            waste.color == "waste/plastic2.png" ||
            waste.color == "waste/plastic3.png") {
            waste.wasteColor = "yellow";
        }
    }
    for (const elem of placesArr) {
        if (elem.y == canvH * 16 / 100 + 1) {
            elem.empty = true;
        } else {
            elem.empty = false;
        }
    }
    time = new Component("30px", "Arial", raisinBlack, canvW / 2, 55,
        "midtxt");
    visualize = new Component(wasteSize, wasteSize, "white", 0, 0, "frame");
    visualize.active = false;
    myMenu.start();
}

const myMenu = {
    canvas: myCanvas,
    start: function () {
        mySwitch = "menu";
        this.canvas.width = canvW;
        this.canvas.height = canvH;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateMyMenu, 1000 / 60);
        window.addEventListener("click", onMouseClick, false);
        window.addEventListener("mousemove", onMouseMove, false);
    },
    clear: function () {
        this.context.clearRect(0, 0, canvW, canvH);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

const gameArea = {
    canvas: myCanvas,
    start: function () {
        startTime = new Date();
        mySwitch = "gamearea";
        myMenu.stop();
        this.canvas.width = canvW;
        this.canvas.height = canvH;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(function () {
            pulseFrame();
            updateGameArea();
        }, 1000 / 60);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        window.setTimeout(reset, 1000);
    }
}

function onMouseClick() {
    if (mySwitch == "menu" &&
        checkMouse(startButton, mouseX, mouseY)) {
        gameArea.start();
    } else if (mySwitch == "gamearea") {
        for (const waste of wasteArr) {
            if (waste.active) {
                for (let place of placesArr) {
                    if (checkMouse(place, mouseX, mouseY) &&
                        place.color == "lightyellow") {
                        setEmptyState(waste);
                        waste.x = place.x - 1;
                        waste.y = place.y - 1;
                        place.empty = false;
                        setInactive(waste);
                        return;
                    }
                }
                setInactive(waste);
                return;
            }
            if (checkMouse(waste, mouseX, mouseY) &&
                checkCanBeMoved(waste)) {
                setActive(waste);
            }
        }
    }
}

function onMouseMove(e) {
    let tmpElem = document.getElementById("myCanvas");
    let canvCurrPos = tmpElem.getBoundingClientRect();
    mouseX = e.clientX - canvCurrPos.left;
    mouseY = e.clientY - canvCurrPos.top;
}


function setActive(gamePiece) {
    gamePiece.active = true;
    visualize.active = true;
    visualize.x = gamePiece.x;
    visualize.y = gamePiece.y;
}

function setInactive(gamePiece) {
    gamePiece.active = false;
    visualize.active = false;
    for (const place of placesArr) {
        place.color = raisinBlack;
    }
}

function setEmptyState(gamePiece) {
    for (const place of placesArr) {
        if (place.x - 1 == gamePiece.x && place.y - 1 == gamePiece.y) {
            place.empty = true;
        }
    }
}

function setActivePlaces(gamePiece) {
    //ennek muszáj külön lenni különben felülíródik
    for (const place of placesArr) {
        if (place.empty) {
            place.color = "lightyellow";
        }
    }
    for (const place of placesArr) {
        //ha a hely a felső sorban van és foglalt
        if (place.y == canvH * 16 / 100 + 1 && place.empty == false) {
            if (place.x - 1 < gamePiece.x) { //ha balra van a foglalt
                for (const place2 of placesArr) {
                    if (place2.x < place.x &&
                        place2.empty) {
                        place2.color = raisinBlack;
                    }
                }
            } else if (place.x - 1 > gamePiece.x) { //ha jobbra van
                for (const place2 of placesArr) {
                    if (place2.x > place.x &&
                        place2.empty) {
                        place2.color = raisinBlack;
                    }
                }
            }
        } else {
            if (place.y == canvH * 41 / 100 + 1 && place.empty) {
                if (place.x - 1 == gamePiece.x &&
                    place.y - 1 < gamePiece.y &&
                    place.empty) {
                    place.color = raisinBlack;
                }
            } else if (place.y == canvH * 56 / 100 + 1 && place.empty) {
                if (place.x - 1 == gamePiece.x &&
                    place.y - 1 < gamePiece.y &&
                    place.empty) {
                    place.color = raisinBlack;
                }
                for (const place2 of placesArr) {
                    if (place2.x == place.x &&
                        place2.y < place.y &&
                        place2.empty) {
                        place2.color = raisinBlack;
                    }
                }
            } else if (place.y == canvH * 71 / 100 + 1 && place.empty) {
                for (const place2 of placesArr) {
                    if (place2.x == place.x &&
                        place2.y < place.y &&
                        place2.empty) {
                        place2.color = raisinBlack;
                    }
                }
            }
        }
    }
}

function checkCanBeMoved(gamePiece) {
    let leftX, leftY, rightX, rightY;
    leftX = gamePiece.x - canvW * 10 / 100 + columnW * 75 / 1000;
    leftY = canvH * 16 / 100;
    rightX = gamePiece.y + canvW * 10 / 100 + columnW * 75 / 1000;
    rightY = canvH * 16 / 100;
    for (const waste of wasteArr) {
        if (gamePiece.x == waste.x && gamePiece.y > waste.y) {
            return false;
        } else if ((waste.x == leftX && waste.y == leftY) &&
            (waste.x == rightX && waste.y == rightY)) {
            return false;
        }
    }
    setActivePlaces(gamePiece);
    return true;
}

function checkMouse(gamePiece, mX, mY) {
    if (mX > gamePiece.x &&
        mX < gamePiece.x + gamePiece.width &&
        mY > gamePiece.y &&
        mY < gamePiece.y + gamePiece.height) {
        return true;
    }
    return false;
}

function Component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "picture") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.update = function () {
        let ctx;
        if (mySwitch == "menu") {
            ctx = myMenu.context;
        } else {
            ctx = gameArea.context;
        }
        if (type == "picture") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else if (type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "midtxt") {
            ctx.font = this.width + " " + this.height;
            ctx.textAlign = "center";
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "frame") {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function checkSolution() {
    let counter = 0
    for (const trashCan of trashCanArr) {
        for (const waste of wasteArr) {
            // if (trashCan.x + canvW * 825 / 10000 == waste.x &&
            //     trashCan.wasteColor == waste.wasteColor) {
            //     counter++;
            // }
            if (trashCan.x + canvW * 800 / 10000 <= waste.x &&
                trashCan.x + canvW * 850 / 10000 >= waste.x &&
                trashCan.wasteColor == waste.wasteColor) {
                counter++;
            }
        }
    }
    return (counter == 12) ? true : false;
}

function gameOver() {
    let ctx = gameArea.context;
    ctx.fillStyle = 'rgba(222,222,222,0.85)';
    ctx.fillRect(0, 0, canvW, canvH);
    let endTxt = new Component("30px", "Arial", raisinBlack, canvW / 2,
        canvH / 2 + 40, "midtxt");
    endTxt.text = "Gratulálunk! Sikerült szétválogatni a hulladékot!";
    endTxt.update();
    let resetTxt = new Component("30px", "Arial", raisinBlack, canvW / 2,
        canvH / 2 + 150, "midtxt");
    resetTxt.text = "Nyomj le egy billentyűt az újraindításhoz!";
    resetTxt.update();
    gameArea.stop();
}

function reset() {
    window.addEventListener('keypress', function () {
        //angular typescript féle this.ngOnInit() kell majd ide asszem
        location.reload();
    })
}

function updateMyMenu() {
    myMenu.clear();
    myMenuBG.update();
    startButton.update();
    for (const intro of introArr) {
        intro.update();
    }
}

function updateGameArea() {
    count();
    gameArea.clear();
    gameAreaBG.update();
    topRow.update();
    for (const column of columnArr) {
        column.update();
    }
    for (const trashCan of trashCanArr) {
        trashCan.update();
    }
    for (const place of placesArr) {
        place.update();
    }
    for (const waste of wasteArr) {
        waste.update();
    }
    if (visualize.active) {
        visualize.update();
    }
    if (checkSolution()) {
        gameOver();
    }
    time.update();
}

function count() {
    let now = new Date();
    let timeDiff = (now - startTime) / 1000;
    let min = Math.floor(Math.round(timeDiff) / 60);
    if (min < 10) {
        min = "0" + min;
    }
    let sec = Math.round(timeDiff) % 60;
    if (sec < 10) {
        sec = "0" + sec;
    }
    time.text = "Idő: " + min + ":" + sec;
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function pulseFrame() {
    let step = 5;
    switch (gradient) {
        case 1: // R és B csökken 0-ra (zölddé az egész válik)
            if (G == 0) {
                gradient = 2;
            } else {
                G -= step;
                B -= step;
            }
            break;
        case 2: // megyek sötétzöld irányba
            if (R == 205) {
                gradient = 3;
            } else {
                R -= step;
            }
            break;
        case 3: // sötétzöldből vissza
            if (R == 255) {
                gradient = 4;
            } else {
                R += step;
            }
            break;
        case 4: // R és B nő 255-re (vissza fehérre)
            if (G == 255) {
                gradient = 1;
            } else {
                G += step;
                B += step;
            }
    }
    visualize.color = "rgb(" + R + ", " + G + ", " + B + ")";
}

startGame();