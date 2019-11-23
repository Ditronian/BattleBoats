var canvas = document.getElementById("gamecanvas");
var ctx = canvas.getContext("2d");

/**
 * Sleeps for the specified amount of milliseconds... should be called with await keyword...
 */
function sleepWait(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

/**
 * Represents game audio. Can be used to play sounds in game
 */
class Sound {
    
    static MUTED = false;
    static ALL_SOUNDS = [];

    /**
     * Creates a new sound element for playing a sound effect...
     * 
     * @param soundSrc: The path to the sound file.
     * @param background: If true, this sound is considered background music and will be auto played on construction 
     *                    and whenever music is unmuted...
     */
    constructor(soundSrc, background) {
        this.soundElm = document.createElement("audio");
        this.soundElm.src = soundSrc;
        this.soundElm.setAttribute("preload", "auto");
        this.soundElm.setAttribute("controls", "none");
        this.soundElm.style.display = "none";
        Sound.ALL_SOUNDS.push(this);
        
        document.body.append(this.soundElm);
        
        // If background music immediately start playing it...
        if(background) {
            this.background = true;
            this.soundElm.loop = true;
        }
        else {
            this.background = false;
        }
    }

    /**
     * Set the volume of the audio...
     * 
     * @param value: A float between 0 and 1, 1 being max volume and 0 being no volume...
     */
    setVolume(value) {
        this.soundElm.volume = value;
    }

    /**
     * Get the volume of this sound effect.
     * 
     * @returns {number}: Float between 0 and 1 representing the volume of this sound when played...
     */
    getVolume() {
        return this.soundElm.volume;
    }

    /**
     * Play the sound effect...
     */
    play() {
        if(!Sound.MUTED) {
            this.soundElm.play();
        }
    }
    
    /**
     * Stop the sound effect...
     */
    stop() {
        this.soundElm.pause();
        if(!this.background) this.soundElm.currentTime = 0;
    }

    /**
     * Mute all sound effects, stopping them immediately...
     */
    static mute() {
        this.MUTED = true;
        for(var i = 0; i < this.ALL_SOUNDS.length; i++) {
            this.ALL_SOUNDS[i].stop();
        }
    }

    /**
     * Unmute all sound effects, starting them if they are background music...
     */
    static unmute() {
        this.MUTED = false;
        for(var i = 0; i < this.ALL_SOUNDS.length; i++) {
            if(this.ALL_SOUNDS[i].background) this.ALL_SOUNDS[i].play();
        }
    }

    /**
     * Mutes all background music... Use unmute to restart background music...
     */
    static muteBackground() {
        for(var i = 0; i < this.ALL_SOUNDS.length; i++) {
            if(this.ALL_SOUNDS[i].background) this.ALL_SOUNDS[i].stop();
        }
    }
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

    /**
     * Determines if the tile has rendered a complete cycle yet. If so, returns true...
     */
    hasCycled() {};
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
        this.cycle = false;
    }
    
    getRenderRate() {
        return this.renderRate;
    }
    
    setRenderRate(rate) {
        if(0 < rate) {
            this.renderRate = rate;
        }
        else{
            throw RangeError("Render rate must be greater then 0...");
        }
    }
    
    draw(x, y, width, height) {
        var currentStep = Math.floor(this.cTime / this.renderRate);
        
        this.ctx.drawImage(this.img, this.img.height * currentStep, 0, this.img.height, this.img.height, x, y, width, height);
    }
    
    update(timeStep) {
        // Update the current time...
        this.cTime = (this.cTime + timeStep);
        // If the current time has surpassed all images, flip hasCycles Flag...
        if(this.cTime >= (this.renderRate * this.numSteps)) this.cycle = true;
        // Modulo current time in the case it has moved passed all frames, so as to loop around...
        this.cTime = this.cTime % (this.renderRate * this.numSteps);
    }
    
    reset() {
        this.cTime = 0;
        this.cycle = false;
    }
    
    hasCycled() {
        return this.cycle;
    }
}


// TODO: More Docs, especially for class below...
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
    
    if((ClickLocation.tileX >= 0) && (ClickLocation.tileY >= 0)) {
        if(ClickLocation.initialTrigger) SoundEffects.explosion.play();
        ClickLocation.initialTrigger = false;
        
        if(ImageTiles.explosion.hasCycled()) {
            ClickLocation.tileX = -1;
            ClickLocation.tileY = -1;
            ImageTiles.explosion.reset();
            SoundEffects.explosion.stop();
        }
        else {
            battleBoard.renderTile(ClickLocation.tileX, ClickLocation.tileY, ImageTiles.explosion);
        }
    }
    else {
        ImageTiles.explosion.reset();
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
    // Initialize sound if not already done...
    if(firstMute) {
        Sound.unmute();
        firstMute = false;
    }
    
    // If the animation is still running return immediately...
    if((ClickLocation.tileX >= 0) || (ClickLocation.tileY >= 0)) return;
    // Get mouse location...
    var [x, y] = getCanvasMousePosition(event, canvas);
    // Get tile location and set it as the current click...
    var tileLoc = battleBoard.getTileClicked(x, y);
    ClickLocation.tileX = tileLoc[0];
    ClickLocation.tileY = tileLoc[1];
    ClickLocation.initialTrigger = true;
}

function onhover(event) {
    // Get mouse location...
    var [x, y] = getCanvasMousePosition(event, canvas);
    // Get the tile location, if valid set the current hovered over tile location.
    var tileLoc = battleBoard.getTileClicked(x, y);
    HoverLocation.tileX = tileLoc[0];
    HoverLocation.tileY = tileLoc[1];
}

// Sets hover positions to off state when mouse exits canvas...
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

// Adding all event listeners to listen for user input...
canvas.addEventListener("click", onclick, false);
canvas.addEventListener("mousemove", onhover, false);
canvas.addEventListener("mouseout", onhoverout, false);

// Array specifies what tiles should be loaded. First value is the final name in the image tiles object. The second
// value specifies the source image for the tile. The last value specifies the animation speed.
var imagesSources = [
    ["water", "Images/TestWaterTiles.png", 150], 
    ["hover", "Images/TestHoverTiles.png", 200],
    ["explosion", "Images/TestExplosionTiles.png", 50]
];

// Array specifies what sounds should be loaded. First value is the name in the SoundEffects object, second is the 
// source file, the third is the volume, and the fourth is whether or not the sound is background music.
var soundSources = [
    ["explosion", "Audio/tnt.mp3", 1, false],
    ["missionImpossible", "Audio/mi.mp3", 0.5, true]
];

// Stores all loaded image tiles...
var ImageTiles = {};
// Stores all sound effects...
var SoundEffects = {};

var firstMute = true;

// Represents current hover location, set to -1, -1 if user mouse in not within canvas...
var HoverLocation = {
    "tileX": -1,
    "tileY": -1
};

// Represents current click location in an identical way as HoverLocation does...
var ClickLocation = {
    "tileX": -1,
    "tileY": -1,
    "initialTrigger": false
};

var lastRender = 0;
battleBoard = new Board(0, 0, canvas.width, canvas.height, 10);

/**
 * Begins game execution and loads tiles, setting up the tiling system...
 * 
 * @returns {Promise<void>}
 */
async function beginGame() {
    // Phase 1, load all sound effects...
    for(var i = 0; i < soundSources.length; i++) {
        var sound = new Sound(soundSources[i][1], soundSources[i][3]);
        sound.setVolume(soundSources[i][2]);
        SoundEffects[soundSources[i][0]] = sound;
        Sound.mute();
    }
    
    // Phase 2, load all game tiles...
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
