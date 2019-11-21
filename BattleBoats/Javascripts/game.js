var canvas = document.getElementById("gamecanvas");
var ctx = canvas.getContext("2d");

var width;
var height;

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
        this.renderRate = 10;
        this.rotateState = 0;
        this.img = img;
        this.numSteps = img.width % img.height;
        this.cTime = 0;
    }
    
    draw(timeStep, x, y, width, height) {
        var currentStep = Math.floor(this.cTime / this.renderRate);
        this.ctx.drawImage(this.img, x, y, width, height, this.img.height * currentStep, 0, this.img.height, this.img.width)
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
        this.gridSize = size;
    }
    
    renderTile(tileX, tileY, tile, timeStep) {
        var tileCoordW = (this.width / this.gridSize);
        var tileCoordH = (this.height / this.gridSize);
        var tCoordX = this.x + Math.floor(tileX * tileCoordW);
        var tCoordY = this.y + Math.floor(tileY * tileCoordH);
        
        tile.draw(timeStep, tCoordX, tCoordY, tileCoordW, tileCoordH);
    }
    
    getTileClicked(x, y) {
        var tileCoordW = (this.width / this.gridSize);
        var tileCoordH = (this.height / this.gridSize);
        
        var tileX = Math.floor(x % tileCoordW);
        var tileY = Math.floor(y % tileCoordH);
        
        if((tileX < 0) || (tileY < 0) || (tileY >= this.gridSize) || (tileX >= this.gridSize)) {
            return [-1, -1]
        }
        
        return [tileX, tileY];
    }
}
    
    
var resize = function() {
    width = window.innerWidth * 2;
    height = window.innerHeight * 2;
    canvas.width = width;
    canvas.height = height;
}

window.onresize = resize
resize()

ctx.fillStyle = 'red'

var state = {
    x: (width / 2),
    y: (height / 2),
    pressedKeys: {
        left: false,
        right: false,
        up: false,
        down: false
    }
}

function update(progress) {
    if (state.pressedKeys.left) {
        state.x -= progress
    }
    if (state.pressedKeys.right) {
        state.x += progress
    }
    if (state.pressedKeys.up) {
        state.y -= progress
    }
    if (state.pressedKeys.down) {
        state.y += progress
    }

    if (state.x > width) {
        state.x -= width
    }
    else if (state.x < 0) {
        state.x += width
    }
    if (state.y > height) {
        state.y -= height
    }
    else if (state.y < 0) {
        state.y += height
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height)

    ctx.fillRect(state.x - 10, state.y - 10, 20, 20)
}

function loop(timestamp) {
    var progress = timestamp - lastRender

    update(progress)
    draw()

    lastRender = timestamp
    window.requestAnimationFrame(loop)
}
var lastRender = 0
window.requestAnimationFrame(loop)

var keyMap = {
    68: 'right',
    65: 'left',
    87: 'up',
    83: 'down'
}

function onclick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // TODO: Finish
    
}

canvas.addEventListener("click", onclick, false);