let canvas = document.getElementById("gamecanvas");
let ctx = canvas.getContext("2d");

/**
 * Sleeps for the specified amount of milliseconds... should be called with await keyword...
 */
function sleepWait(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

/**
 * Utility class which provides useful methods for drawing to the canvas...
 */
class CanvasDrawer {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
    }

    /**
     * Draws an image to the canvas...
     * 
     * @param img: The image to render to the screen... Required argument...
     * @param canvasX: The x location in the canvas to draw the object to. Defaults to 0.
     * @param canvasY: The y location in the canvas to draw the object to. Defaults to 0.
     * @param canvasW: The width of the image on the canvas... Defaults to the image height...
     * @param canvasH: The height of the image on the canvas... Defaults to the image width...
     * @param canvasRot: The rotation of the image on the canvas in degrees. Note method computes bounding box first 
     *                   then rotates the object using the center of the bounding box as the reference. Defaults to 0.
     * @param imgX: The x location within the image to use (right edge of bounding box). Defaults to 0.
     * @param imgY: The y location within the image to use (top edge of bounding box). Defaults to 0.
     * @param imgW: The width of the bounds within the image to include in drawing to canvas. Defaults to entire image width...
     * @param imgH: The height of the bounds within the image to include in drawing to canvas. Defaults to entire image height...
     */
    drawImage(img, canvasX = 0, canvasY = 0, canvasW = img.width, canvasH = img.height, canvasRot = 0, 
              imgX = 0, imgY = 0, imgW = img.width, imgH = img.height) {
        // Save current context for restoring it later...
        this.context.save();
        // Magic Coordinate Adjustment Code.... To fix position of tile...
        let rotRad = canvasRot * (Math.PI / 180);
        let [cosRot, sinRot] = [Math.abs(Math.cos(rotRad)), Math.abs(Math.sin(rotRad))];
        let rotW = (cosRot * canvasW) + (sinRot * canvasH);
        let rotH = (sinRot * canvasW) + (cosRot * canvasH);
        // Move the origin of the canvas to the center of where we want to plot the tile...
        this.context.translate(canvasX + (rotW / 2), canvasY + (rotH / 2));
        // Rotate the context renderer...
        this.context.rotate(rotRad);
        // Execute the draw command now...
        this.context.drawImage(img, imgX, imgY, imgW, imgH, -(canvasW / 2), -(canvasH / 2), canvasW, canvasH);
        // Restore original context rendering settings...
        this.context.restore();
    }
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
        for(let i = 0; i < this.ALL_SOUNDS.length; i++) {
            this.ALL_SOUNDS[i].stop();
        }
    }

    /**
     * Unmute all sound effects, starting them if they are background music...
     */
    static unmute() {
        this.MUTED = false;
        for(let i = 0; i < this.ALL_SOUNDS.length; i++) {
            if(this.ALL_SOUNDS[i].background) this.ALL_SOUNDS[i].play();
        }
    }

    /**
     * Mutes all background music... Use unmute to restart background music...
     */
    static muteBackground() {
        for(let i = 0; i < this.ALL_SOUNDS.length; i++) {
            if(this.ALL_SOUNDS[i].background) this.ALL_SOUNDS[i].stop();
        }
    }
}

/**
 * A Tile, Abstract class used for representing game tiles. Can be updated and rendered... No concept of collision
 * detection...
 */
class Tile {
    
    static UP = 0;
    static DOWN = 2;
    static LEFT = 3;
    static RIGHT = 1;

    /**
     * Construct a new Tile;
     * 
     * @param drawer: The CanvasDrawer object to use for rendering...
     */
    constructor(drawer) {
        this.drawer = drawer;
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
     * @param rotateState
     */
    draw(timeStep, x, y, width, height, rotateState = Tile.UP) {};

    /**
     * For use by subclasses converts rotate argument on draw to an angle in radians...
     * 
     * @param direction: The direction, as passed to the draw method...
     */
    static getRotateAngle(direction) {
        if((direction > 3) || (direction < 0)) throw new RangeError("Rotation direction must be between 0 and 3");
        // Multiply number by pi/2 radians since each increase in the direction values rotates the tile 90 degrees... 
        return (direction * 90);
    }
    
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
 * Represents a collection of tiles... These are set up as coordinates away from a relative origin...
 * TODO: Really needs some docs... Cause this class is absurdly complex...
 * TODO: Implement all methods from Tile super class
 */
class MultiTile extends Tile {
    constructor(tileList, coordinateList, rotationStates) {
        super();
        this.tiles = {};
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;
        this._size = 0;
        this.rotateState = Tile.UP;
        // If tiles were passed add them...
        if(tileList !== undefined) this.addTiles(tileList, coordinateList, rotationStates);
    }
    
    getRotateState() {
        return this.rotateState;
    }
    
    setRotateState(val) {
        val = Math.floor(val);
        if((val <= Tile.LEFT) && (val >= Tile.UP)) this.rotateState = val;
    }
    
    // Magical iterator for this object to iterate coords of all tiles...
    *[Symbol.iterator]() {
        for(const strCoord in this.tiles) {
            yield Array.from(strCoord.split(","), Number);
        }
    }
    
    width() {
        return (this.maxX - this.minX) + 1;
    }
    
    height() {
        return (this.maxY - this.minY) + 1;
    }
    
    addTiles(tiles, coordinates, rotationStates) {
        for(let i = 0; i < tiles.length; i++) {
            if(!(coordinates[i] in this.tiles)) this._size++;
            this.tiles[coordinates[i]] = [tiles[i], rotationStates[i]];
        }
        this.updateBounds();
    }
    
    addTile(tile, coordinates, rotationState) {
        if(!(coordinates in this.tiles)) this._size++;
        this.tiles[coordinates] = [tile, rotationState];
        this.updateBounds(coordinates);
    }
    
    getTile(coordinates) {
        return this.tiles[coordinates][0];
    }
    
    getTileRotation(coordinates) {
        return this.tiles[coordinates][1];
    }
    
    delTile(coordinates) {
        delete this.tiles[coordinates];
        this._size--;
        this.updateBounds();
    }
    
    size() {
        return this._size;
    }
    
    update(timeStep) {
        for(const [x, y] of this) {
            let tile = this.getTile([x, y]);
            tile.update(timeStep);
        }
    }
    
    hasCycled() {
        for(const coord of this) {
            if(!this.getTile(coord).hasCycled()) return false;
        }
        return true;
    }
    
    reset() {
        for(const coord of this) {
            this.getTile(coord).reset();
        }
    }

    getRotatedCoords(x, y) {
        switch (this.getRotateState()) {
            case Tile.UP:
                return [x, y];
            case Tile.RIGHT:
                return [y, -x];
            case Tile.DOWN:
                return [-x, -y];
            case Tile.LEFT:
                return [-y, x];
            default:
                throw new RangeError("NOOOO!!!!")
        }
    }
    
    getRotatedWidthHeight() {
        if((this.getRotateState() === Tile.LEFT) || (this.getRotateState() === Tile.RIGHT)) {
            return [this.height(), this.width()];
        }
        else {
            return [this.width(), this.height()];
        }
    }
    
    *getTranslatedCoords(board, tileX, tileY) {
        // LOOK OUT BELOW!!! Ridiculous translation and rotation code below...
        // All this makes sure multi tile will actually fit...
        const [width, height] = this.getRotatedWidthHeight();
            
        if((width > board.width) || (height > board.height)) {
            throw new RangeError("Board is smaller then the multi tile!!!");
        }
        // Transform min/max values to match rotations... Literally rotate them around in an array...
        let bounds = [this.minX, this.minY, this.maxX, this.maxY];
        let transform = [-1, -1, 1, 1];
        // N^2 but who cares, always just 4 elements...
        for(let i = 0; i < this.getRotateState(); i++) {
            bounds.unshift(bounds.pop());
        }
        // Correct the signs on the values...
        for(let i = 0; i < bounds.length; i++) bounds[i] = Math.abs(bounds[i]) * transform[i];
        
        // Correct center coordinate if origin is to close to the edges...
        if((tileX + Math.abs(bounds[2])) >= board.xTiles) tileX = board.xTiles - (Math.abs(bounds[2]) + 1);
        if((tileX - Math.abs(bounds[0])) < 0) tileX = Math.abs(bounds[0]);
        if((tileY + Math.abs(bounds[3])) >= board.yTiles) tileY = board.yTiles - (Math.abs(bounds[3]) + 1);
        if((tileY - Math.abs(bounds[1])) < 0) tileY = Math.abs(bounds[1]);
        
        for(const [x, y] of this) {
            let [rx, ry] = this.getRotatedCoords(x, y);
            yield [x, y, tileX + rx, tileY + ry];
        }
    }
    
    drawToBoard(board, tileX, tileY) {
        // Iterate all coordinates correctly translated using getTranslatedCoords generator...
        for(const [x, y, transX, transY] of this.getTranslatedCoords(board, tileX, tileY)) {
            // Render, rotating tile relative to rotation of the whole thing...
            let [tile, rot] = this.tiles[[x, y]];
            board.renderTile(transX, transY, tile, (this.getRotateState() + rot) % 3)
        }
    }
    
    // Does exactly what you expect...
    updateBounds(tileCoord) {
        if(tileCoord !== undefined) {
            let [x, y] = tileCoord;
            if(x < this.minX) this.minX = x;
            if(x > this.maxX) this.maxX = x;
            if(y < this.minY) this.minY = y;
            if(y > this.maxY) this.maxY = y;
        }
        else {
            for(const [x, y] of this) {
                if(x < this.minX) this.minX = x;
                if(x > this.maxX) this.maxX = x;
                if(y < this.minY) this.minY = y;
                if(y > this.maxY) this.maxY = y;
            }
        }
    }
}

/**
 * Special MultiTile which represents a boat...
 */
class Boat extends MultiTile {
    constructor(tileLength = 2) {
        if(tileLength < 2) throw new RangeError("Boat needs to be at least length 2...");
        // Compute relative start and end y locations of the boat relative to origin...
        let startY = -Math.floor((tileLength + 1) / 2) + 1;
        let endY = Math.floor(tileLength / 2);
        
        // Add the boat tips...
        super(new Array(2).fill(ImageTiles.boatTip), [[0, startY], [0, endY]], [Tile.UP, Tile.DOWN]);
        startY++;
        endY--;
        
        for(let y = startY; y <= endY; y++) {
            let rot = (Math.abs(y % 2) === 0)? Tile.UP: Tile.DOWN;
            this.addTile(ImageTiles.boatMiddle, [0, y], rot);
        }
        // Create another multi-tile for previewing boat info...
        this.preview = new MultiTile(new Array(this.size()).fill(ImageTiles.hover), [...this], 
            new Array(this.size()).fill(Tile.UP));
    }
    
    getPreview() {
        this.preview.setRotateState(this.getRotateState());
        return this.preview;
    }
}

/**
 * Animated game tile, accepts an image with all frames layed out horizontally and renders them at the renderRate,
 * which can be adjusted...
 */
class AnimatedTile extends Tile {
    constructor(drawer, img) {
        super(drawer);
        this.renderRate = 50;
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
            throw new RangeError("Render rate must be greater then 0...");
        }
    }
    
    draw(x, y, width, height, rotate = AnimatedTile.UP) {
        // Compute the current frame we are on...
        if((rotate === AnimatedTile.RIGHT) || (rotate === AnimatedTile.LEFT)) {
            // If plotting in left or right mode flip the width and the height...
            let temp = width;
            width = height;
            height = temp;
        }
        
        rotate = AnimatedTile.getRotateAngle(rotate);
        
        let currentStep = Math.floor(this.cTime / this.renderRate);
        
        this.drawer.drawImage(this.img, x, y, width, height, rotate, this.img.height * currentStep, 0, 
                              this.img.height, this.img.height);
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
/**
 * Represents a game board. Allows a user to draw tiles without having to give the exact coordinates for the tiles...
 */
class Board {
    constructor(x, y, width, height, tilesX, tilesY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xTiles = tilesX;
        this.yTiles = tilesY;
    }
    
    invalidCoordinate(tileX, tileY) {
        return (tileX < 0) || (tileY < 0) || (tileY >= this.yTiles) || (tileX >= this.xTiles);
    }
    
    renderTile(tileX, tileY, tile, rotationState = Tile.UP) {
        if(this.invalidCoordinate(tileX, tileY)) {
            return;
        }
        let tileCoordW = (this.width / this.xTiles);
        let tileCoordH = (this.height / this.yTiles);
        
        tile.draw(this.x + (tileCoordW * tileX), this.y + (tileCoordH * tileY), tileCoordW, tileCoordH, rotationState);
    }
    
    renderMultiTile(tileX, tileY, multiTile) {
        if(this.invalidCoordinate(tileX, tileY)) return;
        multiTile.drawToBoard(this, tileX, tileY);
    }
    
    getTileClicked(x, y) {
        let tileCoordW = (this.width / this.xTiles);
        let tileCoordH = (this.height / this.yTiles);
        
        let tileX = Math.floor(x / tileCoordW);
        let tileY = Math.floor(y / tileCoordH);

        if(this.invalidCoordinate(tileX, tileY)) {
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
    if(delayTime > 0) delayTime = delayTime - progress;
}

function draw() {
    // We begin by filling in the background animated water tiles...
    for(let i = 0; i < battleBoard.xTiles; i++) {
        for(let j = 0; j < battleBoard.yTiles; j++) {
            battleBoard.renderTile(i, j, ImageTiles.water);
        }
    }
    // Render placed boats...
    for(const [coords, boat] of placedBoats) {
        battleBoard.renderMultiTile(coords[0], coords[1], boat);
    }
    
    // If user is hovered over a tile, render a hover tile to that location...
    if((HoverLocation.tileX >= 0) && (HoverLocation.tileY >= 0)) {
        if(unplacedBoats.length > 0) {
            battleBoard.renderMultiTile(HoverLocation.tileX, HoverLocation.tileY, 
                unplacedBoats[unplacedBoats.length - 1].getPreview())
        }
        else {
            battleBoard.renderTile(HoverLocation.tileX, HoverLocation.tileY, ImageTiles.hover);
        }
    }
    
    if(delayTime > 0) return;
    
    if((ClickLocation.tileX >= 0) && (ClickLocation.tileY >= 0)) {
        if(unplacedBoats.length > 0) {
            placedBoats.push([[ClickLocation.tileX, ClickLocation.tileY], unplacedBoats.pop()]);
            ClickLocation.tileX = -1;
            ClickLocation.tileY = -1;
            delayTime = 500;
            return;
        }
        
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
    let progress = timestamp - lastRender;

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
    let [x, y] = getCanvasMousePosition(event, canvas);
    // Get tile location and set it as the current click...
    let tileLoc = battleBoard.getTileClicked(x, y);
    ClickLocation.tileX = tileLoc[0];
    ClickLocation.tileY = tileLoc[1];
    ClickLocation.initialTrigger = true;
}

function onhover(event) {
    // Get mouse location...
    let [x, y] = getCanvasMousePosition(event, canvas);
    // Get the tile location, if valid set the current hovered over tile location.
    let tileLoc = battleBoard.getTileClicked(x, y);
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
    let boundingRect = canvas.getBoundingClientRect();
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
let imagesSources = [
    ["water", "Images/TestWaterTiles.png", 150], 
    ["hover", "Images/TestHoverTiles.png", 200],
    ["explosion", "Images/TestExplosionTiles.png", 50],
    ["boatTip", "Images/BoatFrontTile.png", 100],
    ["boatMiddle", "Images/BoatMiddleTile.png", 100]
];

// Array specifies what sounds should be loaded. First value is the name in the SoundEffects object, second is the 
// source file, the third is the volume, and the fourth is whether or not the sound is background music.
let soundSources = [
    ["explosion", "Audio/tnt.mp3", 1, false],
    ["missionImpossible", "Audio/mi.mp3", 0.5, true]
];

// Stores all loaded image tiles...
let ImageTiles = {};
// Stores all sound effects...
let SoundEffects = {};

let firstMute = true;

// Represents current hover location, set to -1, -1 if user mouse in not within canvas...
let HoverLocation = {
    "tileX": -1,
    "tileY": -1
};

// Represents current click location in an identical way as HoverLocation does...
let ClickLocation = {
    "tileX": -1,
    "tileY": -1,
    "initialTrigger": false
};

let lastRender = 0;
let delayTime = 0;
battleBoard = new Board(0, 0, canvas.width, canvas.height, 20, 20);

// Create canvas drawing object...
let drawer = new CanvasDrawer(canvas, ctx);

/**
 * Begins game execution and loads tiles, setting up the tiling system...
 * 
 * @returns {Promise<void>}
 */
async function beginGame() {
    // Phase 1, load all sound effects...
    for(let i = 0; i < soundSources.length; i++) {
        let sound = new Sound(soundSources[i][1], soundSources[i][3]);
        sound.setVolume(soundSources[i][2]);
        SoundEffects[soundSources[i][0]] = sound;
        Sound.mute();
    }
    
    // Phase 2, load all game tiles...
    for(let i = 0; i < imagesSources.length; i++) {
        // Create an image and set its source...
        let image = new Image();
        image.src = imagesSources[i][1];
        // Wait around until image is actually loaded and width has been computed...
        while((image.width === undefined) || (image.width === 0)) await sleepWait(5);
        // Create a new animated tile and set it's render speed to the one specified in the array...
        let tile = new AnimatedTile(drawer, image);
        tile.setRenderRate(imagesSources[i][2]);
        // Add the newly created animated tile to our list of tile objects...
        ImageTiles[imagesSources[i][0]] = tile;
    }

    unplacedBoats = [new Boat(2), new Boat(2), new Boat(3), new Boat(5)];
    placedBoats = [];
    
    // Begin the game loop...
    window.requestAnimationFrame(loop);
}

beginGame();
