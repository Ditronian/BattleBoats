var canvas = document.getElementById("gamecanvas");
var ctx = canvas.getContext("2d");

class Tile {
    constructor(ctx) {
        this.ctx = ctx;
    }
    
    update(timeStep) {
    }
    
    draw(timeStep, x, y, width, height) {
    }
    
    rotateLeft() {
    }
}

class AnimatedTile extends Tile {
    constructor(ctx, img) {
        super(ctx);
        this.renderRate = 50; // Rate of rendering in seconds...
        this.rotateState = 0;
        this.img = img;
        this.numSteps = Math.floor(img.width / img.height);
        this.cTime = 0;
    }
    
    draw(x, y, width, height) {
        var currentStep = Math.floor(this.cTime / this.renderRate);
        
        this.ctx.drawImage(this.img, this.img.height * currentStep, 0, this.img.height, this.img.height, x, y, width, height);
        console.log(currentStep, this.img.height * currentStep, 0, this.img.height, this.img.height);
    }
    
    update(timeStep) {
        this.cTime = (this.cTime + timeStep) % (this.renderRate * this.numSteps);
    }
}

class Board {
    constructor(x, y, width, height, size) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tileW = width / size;
        this.tileH = height / size;
        this.gridSize = size;
    }
    
    renderTile(tileX, tileY, tile) {
        if((tileX < 0) || (tileY < 0) || (tileY >= this.gridSize) || (tileX >= this.gridSize)) {
            return;
        }
        var tileCoordW = (this.width / this.gridSize);
        var tileCoordH = (this.height / this.gridSize);
        
        tile.draw(this.x + (tileCoordW * tileX), this.y + (tileCoordH * tileY), tileCoordW, tileCoordH);
    }
    
    getTileClicked(x, y) {
        var tileCoordW = (this.width / this.gridSize);
        var tileCoordH = (this.height / this.gridSize);
        
        var tileX = Math.floor(x % tileCoordW);
        var tileY = Math.floor(y % tileCoordH);

        if((tileX < 0) || (tileY < 0) || (tileY >= this.gridSize) || (tileX >= this.gridSize)) {
            return [-1, -1];
        }
        
        return [tileX, tileY];
    }
}

function update(progress) {
    waterTile.update(progress);
}

function draw() {
    for(var i = 0; i < battleBoard.gridSize; i++) {
        for(var j = 0; j < battleBoard.gridSize; j++) {
            battleBoard.renderTile(i, j, waterTile);
        }
    }
}

function loop(timestamp) {
    var progress = timestamp - lastRender;

    update(progress);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

function onclick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // TODO: Finish
    
}

canvas.addEventListener("click", onclick, false);

const image = new Image();

image.onload = function() {
    waterTile = new AnimatedTile(ctx, image);
    waterTile.renderRate = 100;
    battleBoard = new Board(0, 0, canvas.width, canvas.height, 10);

    window.requestAnimationFrame(loop);
}

var waterTile = undefined;
var battleBoard = undefined;
image.src = "Images/TestWaterTiles.png";
var lastRender = 0;


