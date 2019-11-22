var canvas = document.getElementById("gamecanvas");
var ctx = canvas.getContext("2d");

/**
 * Sleeps for the specified amount of milliseconds... should be called with await keyword...
 */
function sleepWait(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

/**
 * A Tile, Abstract class used for representing game tiles. Can be updated and rendered... No concept of collision
 * detection...
 */
class Tile {
    /**
     * Construct a new Tile;
     * 
     * @param ctx: The canvas 2d context which to render to...
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * Updates the tile based on how much time has passed...
     * 
     * @param timeStep: The amount of time that has passed, in milliseconds...
     */
    update(timeStep) {};

    /**
     * Draw the tile to the screen...
     * 
     * @param timeStep
     * @param x
     * @param y
     * @param width
     * @param height
     */
    draw(timeStep, x, y, width, height) {};

    /**
     * Rotate the tile. Tile will be rotated in all following draws...
     * 
     * @param deg: The rotation amount, in degrees...
     */
    rotate(deg) {};

    /**
     * Reset the tile, clearing timing information...
     */
    reset() {};
}

/**
 * Animated game tile, accepts an image with all frames layed out horizontally and renders them at the renderRate,
 * which can be adjusted...
 */
class AnimatedTile extends Tile {
    constructor(ctx, img) {
        super(ctx);
        this.renderRate = 50;
        this.rotateState = 0;
        this.img = img;
        this.numSteps = Math.floor(img.width / img.height);
        this.cTime = 0;
    }
    
    draw(x, y, width, height) {
        var currentStep = Math.floor(this.cTime / this.renderRate);
        
        this.ctx.drawImage(this.img, this.img.height * currentStep, 0, this.img.height, this.img.height, x, y, width, height);
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
        
        var tileX = Math.floor(x / tileCoordW);
        var tileY = Math.floor(y / tileCoordH);

        if((tileX < 0) || (tileY < 0) || (tileY >= this.gridSize) || (tileX >= this.gridSize)) {
            return [-1, -1];
        }
        
        return [tileX, tileY];
    }
}

function update(progress) {
    // Iterate through the tiles and update the current image they are on...
    for (const tileName in ImageTiles) {
        console.log(tileName);
        console.log(ImageTiles[tileName]);
        ImageTiles[tileName].update(progress);
    }
}

function draw() {
    // We begin by filling in the background animated water tiles...
    for(var i = 0; i < battleBoard.gridSize; i++) {
        for(var j = 0; j < battleBoard.gridSize; j++) {
            battleBoard.renderTile(i, j, ImageTiles.water);
        }
    }
    
    // If user is hovered over a tile, render a hover tile to that location...
    if((HoverLocation.tileX >= 0) && (HoverLocation.tileY >= 0)) {
        battleBoard.renderTile(HoverLocation.tileX, HoverLocation.tileY, ImageTiles.hover);
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

function onhover(event) {
    // Get mouse location...
    var [x, y] = getCanvasMousePosition(event, canvas);
    // Get the tile location, if valid set the current hovered over tile location.
    var tileLoc = battleBoard.getTileClicked(x, y);
    HoverLocation.tileX = tileLoc[0];
    HoverLocation.tileY = tileLoc[1];
}

function onhoverout(event) {
    HoverLocation.tileX = -1;
    HoverLocation.tileY = -1;
}

/**
 * Returns the current mouse location in the canvas rendering coordinate system...
 * 
 * @param event: The mouse event which to get canvas relative coordinates from...
 * @param canvas: The canvas.
 * @returns {number[]}: Array of 2 numbers, x and y coordinates.
 */
function getCanvasMousePosition(event, canvas) {
    // Get absolute width and height of the canvas...
    var boundingRect = canvas.getBoundingClientRect();
    // Compute the scaling required to convert to canvas coordinate system...
    scaleX = canvas.width / boundingRect.width;
    scaleY = canvas.height / boundingRect.height;
    // Apply scaling to coordinates relative to the top left corner of the canvas...
    const x = (event.clientX - boundingRect.left) * scaleX;
    const y = (event.clientY - boundingRect.top) * scaleY;
    
    return [x, y];
}

canvas.addEventListener("click", onclick, false);
canvas.addEventListener("mousemove", onhover, false);
canvas.addEventListener("mouseout", onhoverout, false);

// Array specifies what tiles should be loaded. First value is the final name in the image tiles object. The second
// value specifies the source image for the tile. The last value specifies the animation speed.
var imagesSources = [["water", "Images/TestWaterTiles.png", 100], ["hover", "Images/TestHoverTiles.png", 100]];
var ImageTiles = {};
var HoverLocation = {
    "tileX": -1,
    "tileY": -1
};
var lastRender = 0;
battleBoard = new Board(0, 0, canvas.width, canvas.height, 10);

/**
 * Begins game execution and loads tiles, setting up the tiling system...
 * 
 * @returns {Promise<void>}
 */
async function beginGame() {
    for(var i = 0; i < imagesSources.length; i++) {
        // Create an image and set its source...
        var image = new Image();
        image.src = imagesSources[i][1];
        // Wait around until image is actually loaded and width has been computed...
        while((image.width === undefined) || (image.width === 0)) await sleepWait(5);
        // Create a new animated tile and set it's render speed to the one specified in the array...
        var tile = new AnimatedTile(ctx, image);
        tile.renderRate = imagesSources[i][2];
        // Add the newly created animated tile to our list of tile objects...
        ImageTiles[imagesSources[i][0]] = tile;
    }
    
    // Begin the game loop...
    window.requestAnimationFrame(loop);
}

beginGame();
