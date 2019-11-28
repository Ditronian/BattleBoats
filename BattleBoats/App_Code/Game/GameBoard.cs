using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

// Just for linda, no 1 liner if statements anywhere in this file :)....

namespace BattleBoats
{
    /**
     * Represents the battleship game board. Allows user to specify size, and then check when.
     */
    public class GameBoard
    {
        // Integer to represent a water tile.
        public const int WATER = 0;
        // Location of first -1 tile
        private int sunkUfTile;
        // The game board....
        private int width;
        private int height;
        private int[] board;
        // Represents location of attempted shots by enemy...
        private bool[] shotLoc;
        // Union find object for the board...
        private GameBoardUF boardUf;

        public GameBoard(int width, int height, int[] boatSizes, int[] initBoard)
        {
            // Initialize width and height....
            this.height = width;
            this.width = height;
            // If provided initial board is not big enough for the specified width and height, throw an error...
            if (initBoard.Length != (width * height))
            {
                throw new ArgumentException("Board size does not match provided width and height!!!");
            }
            board = initBoard;
            // Negative values mean the ship is sunk, make all values positive...
            for (int i = 0; i < board.Length; i++)
            {
                board[i] = Math.Abs(board[i]);
            }
            
            shotLoc = new bool[width * height];
            
            // Make a hashmap to store what component sizes should be...
            Dictionary<int, int> componentSizes = new Dictionary<int, int>();
            // Count amount of each component size...
            foreach (int size in boatSizes)
            {
                if (componentSizes.ContainsKey(size))
                {
                    componentSizes[size] = componentSizes[size] + 1;
                }
                else
                {
                    componentSizes[size] = 1;
                }
            }
            
            // We connect all sunken ship tiles to this tile location. This guarantees there is always 3 components on
            // the board before all ships are sunk...
            sunkUfTile = (width * height);
            //Build the UF data structure by connecting adjacent tiles with the same value to each other....
            boardUf = new GameBoardUF((width * height) + 1);

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    // Check all adjacent coordinates for same values...
                    connectIfMatching(x, y, x - 1, y);
                    connectIfMatching(x, y, x + 1, y);
                    connectIfMatching(x, y, x, y - 1);
                    connectIfMatching(x, y, x, y + 1);
                }
            }
            
            // Now we verify all boats are there and are of there expected sizes by uncounting from the hashmap we made.
            foreach (int component in boardUf.getComponents())
            {
                // Yuck, please let me make this one line.... It's just a continue statement...
                // If this component is the water or sunk tile, ignore it....
                if ((component == sunkUfTile) || (board[component] == WATER))
                {
                    continue;
                }
                // If this tile contains a key in the dictionary decrement it. If it becomes 0, delete it.
                int size = boardUf.componentSize(component);
                if (componentSizes.ContainsKey(boardUf.componentSize(component)))
                {
                    componentSizes[size]--;
                    // Again, single line for this would be nice...
                    if (componentSizes[size] <= 0)
                    {
                        componentSizes.Remove(size);
                    }
                }
                // In any case were we don't find a key, the boats don't match the sizes specified, throw an error...
                else
                {
                    throw new ArgumentException("Sizes of boats on board do not match!!!!");
                }
            }
            // We are done, everything has been checked!!!
        }

        /**
         * Converts a 2D index to a 1D index so the data structure can access the correct element location...
         */
        private int to1DIndex(int x, int y)
        {
            if ((x < 0) || (y < 0) || (x >= width) || (y >= height))
            {
                throw new ArgumentException("Index (" + x + ", " + y + ") out of bounds!!!");
            }
            return (y * height) + x;
        }
        
        /**
         * Converts a 1D index to a 2D index, which is useful for user...
         */
        private int[] to2DIndex(int index)
        {
            if ((index < 0) || (index >= (width * height)))
            {
                throw new ArgumentException("Index " + index + " is out of bounds!!!");
            }
            return new int[]{index % width, index / height};
        }
        
        /**
         * Checks if 2 points are matching, and if so connects them...
         */
        private void connectIfMatching(int x1, int y1, int x2, int y2)
        {
            // Grab values and indexes....
            int index1 = to1DIndex(x1, y1);
            int val1 = board[index1];
            int index2 = to1DIndex(x2, y2);
            int val2 = board[index2];
            
            // If value 1 equals value 2, connect the indexes....
            if (val1 == val2)
            {
                boardUf.connect(index1, index2);
            }
        }

        /**
         * Checks if all ships have been destroyed....
         */
        public bool allShipsDestroyed()
        {
            return boardUf.numberComponents() <= 2;
        }

        /**
         * Shoots at the board, returns true if a ship was hit, false if no boat is hit or user already shot the
         * location.
         */
        public bool attemptShot(int x, int y)
        {
            int idx = to1DIndex(x, y);
            if (!hasShot(x, y))
            {
                shotLoc[idx] = true;
                if (board[idx] != WATER)
                {
                    // Make the tile negative, as negative tiles tell us the boat is sunk...
                    board[idx] = -Math.Abs(board[idx]);
                    boardUf.connect(idx, sunkUfTile);
                    return true;
                }
            }

            return false;
        }

        /**
         * Checks to see if the enemy has shot the specified location in the past.
         */
        public bool hasShot(int x, int y)
        {
            return shotLoc[to1DIndex(x, y)];
        }

        /**
         * Checks to see if enemy successfully sunk a boat at the given location. Returns false if attempt was not
         * a boat or if the enemy never shot this location...
         */
        public bool sunkBoat(int x, int y)
        {
            return hasShot(x, y) && (board[to1DIndex(x, y)] < 0);
        }
        
        /**
         * Converts the boat array to a valid json string for javascript to parse...
         */
        public string getBoatArray()
        {
            string[] shipItems = new string[width * height];
            
            for (int i = 0; i < board.Length; i++)
            {
                shipItems[i] = board[i].ToString();
            }
            
            return "{ width: " + width + ", height: " + height + ", array: [" + String.Join(",", shipItems) + 
                   "]}";
        }

        /**
         * Returns the hit array in a valid json format, for javascript to parse... 0 is no attempt, -1 is a miss, and
         * 1 is a hit...
         */
        public string getHitArray()
        {
            string[] hitItems = new string[width * height];

            for (int i = 0; i < shotLoc.Length; i++)
            {
                if (!shotLoc[i])
                {
                    hitItems[i] = "0";
                }
                else if (board[i] < 0)
                {
                    hitItems[i] = "1";
                }
                else
                {
                    hitItems[i] = "-1";
                }
            }
            
            return "{ width: " + width + ", height: " + height + ", array: [" + String.Join(",", hitItems) + 
                   "]}";
        }
    }
}