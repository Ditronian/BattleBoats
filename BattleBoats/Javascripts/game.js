let canvas = document.getElementById("gamecanvas");
let ctx = canvas.getContext("2d");

/**
 * Sleeps for the specified amount of milliseconds... should be called with await keyword...
 */
function sleepWait(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}


// CORE DRAWING API FOR GAME BELOW:


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

    /**
     * Draws text to the canvas...
     * Might eventually add rotation support...
     * 
     * @param text: The text to draw...
     * @param canvasX: The x location to draw the text to...
     * @param canvasY: The y location to draw the text to...
     * @param fontStyle: The font style being the size followed by family...
     * @param fontAlignV: The vertical alignment of the font....
     * @param fontAlignH: The horizontal alignment of the font...
     * @param fontColor: The color of the font, as a string...
     * @param outlineColor: The color to outline the font in...
     */
    drawText(text, canvasX=0, canvasY=0, fontStyle=defaultFont, fontAlignV="top", fontAlignH="left", fontColor = "black", 
             outlineColor=null) {
        this.context.fillStyle = fontColor;
        this.context.strokeStyle = outlineColor;
        this.context.textBaseline = fontAlignV;
        this.context.textAlign = fontAlignH;
        this.context.font = fontStyle;
        this.context.fillText(text, canvasX, canvasY);
        if(outlineColor !== null) this.context.strokeText(text, canvasX, canvasY);
    }

    /**
     * Draws a rectangle to the screen... May eventually add ability to rotate rectangle...
     * 
     * @param x: The x location of the top right corner...
     * @param y: The y location of the top right corner...
     * @param width: The width of the rectangle...
     * @param height: The height of the rectangle...
     * @param fillColor: The color to fill the rectangle with...
     * @param outlineColor: The color to outline the rectangle with...
     */
    drawRect(x, y, width, height, fillColor = "black", outlineColor=null) {
        this.context.fillStyle = fillColor;
        this.context.strokeStyle = outlineColor;
        this.context.fillRect(x, y, width, height);
        if(outlineColor !== null) this.context.strokeRect(x, y, width, height);
    }

    /**
     * Get's the width and the height of some text if it were to be plotted on this canvas...
     * 
     * @param text: The text to measure the dimensions of...
     * @param fontStyle: The font size and style to apply to the text while measuring its dimensions...
     * 
     * @return: {width: number, height: number}
     */
    getTextDimensions(text, fontStyle=defaultFont) {
        this.context.font = defaultFont;
        let measurement = this.context.measureText(text);
        return {"width": measurement.width, "height": measurement.actualBoundingBoxDescent + 
                measurement.actualBoundingBoxAscent};
    }
}


// SOUND HANDLING CLASSES BELOW:


/**
 * Represents game audio. Can be used to play sounds in game
 */
class Sound {
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
// Firefox doesn't support static variables yet, so have to do dumb hack to do class global variables...
Sound.MUTED = false;
Sound.ALL_SOUNDS = [];


// TILE RENDERING CLASSES BELOW:


/**
 * A Tile, Abstract class used for representing game tiles. Can be updated and rendered... No concept of collision
 * detection...
 */
class Tile {
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
// Again, this is to deal with firefox not supporting the static keyword on variables...
Tile.UP = 0;
Tile.DOWN = 2;
Tile.LEFT = 3;
Tile.RIGHT = 1;

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
    
    getCoordsFromRaw(board, thisX, thisY, tileX, tileY) {
        for(const [x, y, transX, transY] of this.getTranslatedCoords(board, thisX, thisY)) {
            if((transX === tileX) && (transY === tileY)) {
                return [x, y];
            }
        }
        return [-1, -1];
    }
    
    getTileRotation(coordinates) {
        return this.tiles[coordinates][1];
    }
    
    delTile(coordinates) {
        delete this.tiles[coordinates];
        this._size--;
        this.updateBounds();
    }
    
    setTile(coordinates, tileObj) {
        this.tiles[coordinates][0] = tileObj;
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
                return [-y, x];
            case Tile.DOWN:
                return [-x, -y];
            case Tile.LEFT:
                return [y, -x];
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
    
    collision(board, tileX, tileY, otherTile, otherTileX, otherTileY) {
        let thisCoords = {};
        for(const [oldx, oldy, x, y] of this.getTranslatedCoords(board, tileX, tileY)) thisCoords[[x, y]] = true; 
        
        for(const [oldx, oldy, x, y] of otherTile.getTranslatedCoords(board, otherTileX, otherTileY)) {
            if([x, y] in thisCoords) return true;
        }
        
        return false;
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
            let rotState = (this.getRotateState() + rot) % 4;
            board.renderTile(transX, transY, tile, rotState)
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
        
        let tileX = Math.floor((x - this.x) / tileCoordW);
        let tileY = Math.floor((y - this.y) / tileCoordH);

        if(this.invalidCoordinate(tileX, tileY)) {
            return [-1, -1];
        }
        
        return [tileX, tileY];
    }
}


// UPDATE METHODS, DRAW METHODS, AND GAME LOOP BELOW:


function update(progress) {
    // Iterate through the tiles and update the current image they are on...
    for (const tileName in ImageTiles) {
        ImageTiles[tileName].update(progress);
    }
    if(delayTime > 0) delayTime = delayTime - progress;
    if((bannerOnScreen !== null) && (bannerOnScreen > 0)) bannerOnScreen = bannerOnScreen - progress;
}


// Sub-Draw functions....


function drawBanner() {
    if(fullScreenImg !== null) {
        fullScreenImg.draw(0, 0, canvas.width, canvas.height, Tile.UP);
        if((ClickLocation.tileX > 0) && (ClickLocation.tileY > 0)) {
            ClickLocation.tileX = -1;
            ClickLocation.tileY = -1;
            if(bannerClickable) {
                stopStatusScreen();
                delayTime = 500;
            }
        }
        if(bannerOnScreen !== null && bannerOnScreen <= 0) {
            stopStatusScreen();
        }
    }
}

function drawBackground() {
    drawer.drawRect(0, 0, canvas.width, canvas.height, "#03466B");
}

function drawText() {
    if(PlayerData !== null) {
        scoreText = "Score: " + PlayerData.scoreData.score;
    }
    
    drawer.drawText(scoreText, canvas.width, 0, defaultFont, "top", "right", "white");
    drawer.drawText(generalMsgText, 0, 0, defaultFont, "top", "left", "white");
}

function drawPlayerBoard() {
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
}

function drawExplosionIndicator() {
    if(inputDisabled) return;

    // If user is hovered over a tile, render a hover tile to that location...
    if((HoverLocation.tileX >= 0) && (HoverLocation.tileY >= 0)) {
        let index = (HoverLocation.tileY * PlayerData.hitBoard.height) + HoverLocation.tileX;

        if(PlayerData.hitBoard.data[index] !== 0) {
            HoverLocation.tileX = -1;
            HoverLocation.tileY = -1;
            return;
        }
        
        battleBoard.renderTile(HoverLocation.tileX, HoverLocation.tileY, ImageTiles.hover);
    }
}

function drawBoatIndicator() {
    if(inputDisabled) return;
    
    // If user is hovered over a tile, render a hover tile to that location...
    if((HoverLocation.tileX >= 0) && (HoverLocation.tileY >= 0)) {
        if(unplacedBoats.length > 0) {
            if(!boatCollision(HoverLocation.tileX, HoverLocation.tileY)) {
                battleBoard.renderMultiTile(HoverLocation.tileX, HoverLocation.tileY, unplacedBoats[unplacedBoats.length - 1].getPreview())
            }
        }
        else {
            battleBoard.renderTile(HoverLocation.tileX, HoverLocation.tileY, ImageTiles.hover);
        }
    }
}

function drawClickBoatPlacement() {
    if(delayTime > 0) return;
    if(inputDisabled) return;

    // If user has 'R' key pressed, rotate current ship at the top of the stack...
    if((unplacedBoats.length) > 0 && ("r" in KeysPressed)) {
        let cboat = unplacedBoats[unplacedBoats.length - 1];
        // Increment boat state by 1 and setup delay to avoid having user rotate the thing 1000 times in a second...
        cboat.setRotateState((cboat.getRotateState() + 1) % 4);
        delete KeysPressed["r"];
        delayTime = 500;
    }

    if((ClickLocation.tileX >= 0) && (ClickLocation.tileY >= 0)) {
        if(boatCollision(ClickLocation.tileX, ClickLocation.tileY)) {
            ClickLocation.tileX = -1;
            ClickLocation.tileY = -1;
            delayTime = 500;
            return;
        }

        if(unplacedBoats.length > 0) {
            placedBoats.push([[ClickLocation.tileX, ClickLocation.tileY], unplacedBoats.pop()]);
            ClickLocation.tileX = -1;
            ClickLocation.tileY = -1;
            delayTime = 500;
            return;
        }
    }

    // If we are out of boats, enter attack phase after server method is called...
    if(unplacedBoats.length <= 0) {
        let boatArr = new Array(battleBoard.xTiles * battleBoard.yTiles).fill(0);
        let boatID = 1;

        for(const [coord, boat] of placedBoats) {
            for(const [x, y, rotx, roty] of boat.getTranslatedCoords(battleBoard, coord[0], coord[1])) {
                boatArr[(roty * battleBoard.yTiles) + rotx] = boatID;
            }
            boatID++;
        }

        function onSuccess(result) {
            GameState = "Attack";
            PlayerData = result;
            ModeSwitched = true;
            generalMsgText = "Click a spot on the board to attack!!!";
            drawStatusScreen(ImageTiles.attackScreen, false, GameStatusScreenDelay);
        }

        function onError(result) {
            GameState = "Loss";
            generalMsgText = "You Cheated!!!";
        }

        PageMethods.initGame(boatArr, onSuccess, onError);
    }
}

function drawClickAttack() {
    if ((ClickLocation.tileX >= 0) && (ClickLocation.tileY >= 0)) {
        let index = (ClickLocation.tileY * PlayerData.hitBoard.height) + ClickLocation.tileX;
        
        if(PlayerData.hitBoard.data[index] !== 0) {
            ClickLocation.tileX = -1;
            ClickLocation.tileY = -1;
            return;
        }
            
        if(ClickLocation.initialTrigger) SoundEffects.explosion.play();
        ClickLocation.initialTrigger = false;

        if(ImageTiles.explosion.hasCycled()) {
            function onSuccess(result) {
                GameState = "BeAttacked";
                generalMsgText = "AI Attacking...";
                PlayerData = result;
                
                if(PlayerData.gameOver) {
                    if(PlayerData.playerWins) {
                        GameState = "Win";
                        drawStatusScreen(ImageTiles.winScreen, false);
                    }
                    return;
                }
                
                if(PlayerData.hitAShip) {
                    drawStatusScreen(ImageTiles.hitScreen, false, GameStatusScreenDelay);
                }
                else {
                    drawStatusScreen(ImageTiles.missScreen, false, GameStatusScreenDelay);

                }
                delayTime = GameStatusScreenDelay * 1.5;
                ModeSwitched = true;
                
            }
            
            function onError(result) {
                generalMsgText = "An Error Occured";
            }
            
            PageMethods.playMove(ClickLocation.tileX, ClickLocation.tileY, onSuccess, onError);
            inputDisabled = true;
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

function drawAttackBoard() {
    for(let y = 0; y < PlayerData.hitBoard.height; y++) {
        for(let x = 0; x < PlayerData.hitBoard.width; x++) {
            let index = (y * PlayerData.hitBoard.height) + x;
            
            battleBoard.renderTile(x, y, ImageTiles.water);
            
            if(PlayerData.hitBoard.data[index] == 1) {
                battleBoard.renderTile(x, y, ImageTiles.shipHit);
            }
            else if(PlayerData.hitBoard.data[index] == -1) {
                battleBoard.renderTile(x, y, ImageTiles.shipMiss);
            }
        }
    }
}

function drawBeingAttacked() {
    if(delayTime > 0) {
        ClickLocation.tileX = -1;
        ClickLocation.tileY = -1;
        return;
    }
    
    // Init Explosion
    let [hitX, hitY] = PlayerData.aiHit;
    if(ModeSwitched) {
        ModeSwitched = false;
        ImageTiles.explosion.reset();
        SoundEffects.explosion.play();
    }
    
    if(!ImageTiles.explosion.hasCycled()) {
        battleBoard.renderTile(hitX, hitY, ImageTiles.explosion);
    }
    else {
        SoundEffects.explosion.stop();
        let index = (PlayerData.shipBoard.height * hitY) + hitX;
        
        if((hitX >= 0 && hitY >= 0) && (PlayerData.shipBoard.data[index] !== 0)) {
            let boatIdx = Math.abs(PlayerData.shipBoard.data[index]) - 1;
            let [boatX, boatY] = placedBoats[boatIdx][0];
            let coords = placedBoats[boatIdx][1].getCoordsFromRaw(battleBoard, boatX, boatY, hitX, hitY);
            let boatTile = placedBoats[boatIdx][1].getTile(coords);
            
            if(boatTile === ImageTiles.boatTip) {
                placedBoats[boatIdx][1].setTile(coords, ImageTiles.boatTipDamaged);
            }
            else if(boatTile === ImageTiles.boatMiddle) {
                placedBoats[boatIdx][1].setTile(coords, ImageTiles.boatMiddleDamaged);
            }
            
            console.log(hitX, hitY, index, boatIdx, coords, ImageTiles.boatTipDamaged, placedBoats[boatIdx][1].getTile(coords));
        }
        PlayerData.aiHit = [-1, -1];

        if(PlayerData.gameOver) {
            if(!PlayerData.playerWins) {
                GameState = "Loss";
                drawStatusScreen(ImageTiles.loseScreen, false);
            }
            return;
        }
        
        generalMsgText = "Click on the Board to Attack Again!!!";
        
        if((ClickLocation.tileX) >= 0 && (ClickLocation.tileY >= 0)) {
            GameState = "Attack";
            ModeSwitched = true;
            inputDisabled = false;
            ClickLocation.tileX = -1;
            ClickLocation.tileY = -1;
            ImageTiles.explosion.reset();
            generalMsgText = "Click a spot on the board to attack!!!";
            drawStatusScreen(ImageTiles.attackScreen, false, GameStatusScreenDelay);
        }
    }
}

// Stores the current mode....
let GameState = "PlaceShips";
// Length to show status screens...
let GameStatusScreenDelay = 750;
// Array stores all draw functions in there original execution order...
let DrawFunctions = {
    "PlaceShips": [drawBackground, drawPlayerBoard, drawBoatIndicator, drawClickBoatPlacement, drawText, drawBanner],
    "Attack": [drawBackground, drawAttackBoard, drawExplosionIndicator, drawClickAttack, drawText, drawBanner],
    "BeAttacked": [drawBackground, drawPlayerBoard, drawBeingAttacked, drawText, drawBanner],
    "Win": [drawBackground, drawAttackBoard, drawText, drawBanner],
    "Loss": [drawBackground, drawPlayerBoard, drawText, drawBanner]
};
// Switched to true right after modes are switched...
let ModeSwitched = false;

// Allow program to pause input/and show a status screen...
function drawStatusScreen(tile, canClickThrough=false, timeOnScreen=null) {
    inputDisabled = true;
    fullScreenImg = tile;
    bannerClickable = canClickThrough;
    bannerOnScreen = timeOnScreen;
}

function stopStatusScreen() {
    inputDisabled = false;
    fullScreenImg = null;
    bannerOnScreen = null;
}

function draw() {
    // Iterate all drawing functions and execute them...
    for(const func of DrawFunctions[GameState]) {
        func();
    }
}

function boatCollision(attemptXPlace, attemptYPlace) {
    if((placedBoats.length === 0) || (unplacedBoats.length <= 0)) return false;
    
    for(const [coords, boat] of placedBoats) {
        let [x, y] = coords;
        if(boat.collision(battleBoard, x, y, unplacedBoats[unplacedBoats.length - 1], attemptXPlace, attemptYPlace)) {
            return true;
        }
    }
    return false;
}

function loop(timestamp) {
    let progress = timestamp - lastRender;

    update(progress);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}


// INPUT HANDLING METHODS BELOW...


function onclick(event) {
    // Initialize sound if not already done...
    if(firstMute) {
        Sound.unmute();
        firstMute = false;
    }
    if(battleBoard === null) return;
    
    // Temp commented out....
    // myFunction();
    
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
    if(battleBoard === null) return;
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

// Adds key to keys pressed....
function onkeydown(event) {
    KeysPressed[event.key] = true;
}

// Removes key when key is released...
function onkeyup(event) {
    delete KeysPressed[event.key];
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
window.addEventListener("keydown", onkeydown, false);
window.addEventListener("keyup", onkeyup, false);


// URL RESOURCE READING/LOADING METHODS BELOW


// For reading json files....
function getJSON(url) {
    return new Promise(function(resolve, reject) {
        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if ((this.readyState === 4) && (this.status === 200)) {
                resolve(JSON.parse(this.responseText));
            }
        };
        
        xmlhttp.onerror = function() {
            reject("Unable to load JSON");
        };
        
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    })
}


// For loading images... 
function loadImage(url) {
    return new Promise(function(resolve, reject) {
        let img = new Image();
        
        img.onload = function() {
            resolve(img);
        };
        img.onerror = function () {
            reject("Unable to load image");
        };
        
        img.src = url;
    })
}

// For executing C# methods and waiting for there response before continuing...
/**
 * Runs the PageMethod provided, passing it the arguments array unpacked, and returns a promise which eventually 
 * returns the result of the method...
 * 
 * @param method: The PageMethod to execute...
 * @param argsArr: The arguments to pass to the method, an array...
 */
function runPageMethod(method, argsArr) {
    return new Promise(function(resolve, reject) {
        if(argsArr === null) {
            method(resolve, reject);
        }
        else{
            method(...argsArr, resolve, reject);
        }
    });
}

// GAME GLOBAL VARIABLES BELOW:


// Array specifies what tiles should be loaded. First value is the final name in the image tiles object. The second
// value specifies the source image for the tile. The last value specifies the animation speed.
let imagesSources = null;

// Array specifies what sounds should be loaded. First value is the name in the SoundEffects object, second is the 
// source file, the third is the volume, and the fourth is whether or not the sound is background music.
let soundSources = null;

// Stores all loaded image tiles...
let ImageTiles = {};
// Stores all sound effects...
let SoundEffects = {};
// Stores the current full screen image...
let fullScreenImg = null;
let bannerClickable = false;
let bannerOnScreen = null;

// Will soon store player board data...
let PlayerData = null;

let firstMute = true;

// Stores font size and style for displaying score...
let textSize = 20;
let textFont = "sans-serif";
let defaultFont = textSize + "px " + textFont;
let scoreText = "Score: 0";
let generalMsgText = "Press 'r' to rotate ships!!!";

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

// Represents any currently pressed keys.... True for pressed and undefined for not pressed....
let KeysPressed = {};
// Some other stuff... Last render time, the time to delay and ignore click events..., 
let lastRender = 0;
let delayTime = 0;
let inputDisabled = true;
let unplacedBoats = null;
let placedBoats = null;
// The board...
let battleBoard = null;

// Create canvas drawing object...
let drawer = new CanvasDrawer(canvas, ctx);


// GAME LOAD AND START METHOD BELOW:


/**
 * Begins game execution and loads tiles, setting up the tiling system...
 * 
 * @returns {Promise<void>}
 */
async function beginGame() {
    imagesSources = await getJSON("Images/tiles.json");
    soundSources = await getJSON("Audio/sounds.json");
    
    // Phase 1, load all sound effects...
    for(let i = 0; i < soundSources.length; i++) {
        let sound = new Sound(soundSources[i][1], soundSources[i][3]);
        sound.setVolume(soundSources[i][2]);
        SoundEffects[soundSources[i][0]] = sound;
        Sound.mute();
    }
    
    // Phase 2, load all game tiles...
    for(let i = 0; i < imagesSources.length; i++) {
        // Create an image and load it...
        let image = await loadImage(imagesSources[i][1]);
        // Create a new animated tile and set it's render speed to the one specified in the array...
        let tile = new AnimatedTile(drawer, image);
        tile.setRenderRate(imagesSources[i][2]);
        // Add the newly created animated tile to our list of tile objects...
        ImageTiles[imagesSources[i][0]] = tile;
    }
    // Load the game settings from the server...
    let GameSettings = await runPageMethod(PageMethods.getSettings, null);
    // Load the board for rendering tiles to...
    battleBoard = new Board(textSize / 2, textSize, canvas.width - textSize, canvas.height - textSize, 
                            GameSettings.boardWidth, GameSettings.boardHeight);
    // Load the boats with there respective sizes...
    unplacedBoats = [];
    for(const boatSize of GameSettings.boatSizes) {
        unplacedBoats.push(new Boat(boatSize));
    }
    placedBoats = [];
    
    // Start "Click to Begin" Screen...
    drawStatusScreen(ImageTiles.beginScreen, true);

    // Begin the game loop...
    window.requestAnimationFrame(loop);
}

// Runs the entire game...
beginGame();


