namespace BattleBoats
{
    /**
     * Represents the battleship game board. Allows user to specify size, and then check when.
     */
    public class GameBoard
    {
        // Integer to represent a water tile.
        public const int WATER = 0;
        // Integer to represent a sunken boat tile. All tiles which are unsunken boats should be positive integers. 
        public const int BOAT_SUNK = -1;
        // The game board....
        private int width;
        private int height;
        private int[][] board;
        // An array which keeps track of the correct amount of boats and their sizes...
        private uint[] boatSizes;
        // Union find object for the board...
        private GameBoardUF boardUf;

        public GameBoard(uint[] boatSizes, int[][] initBoard)
        {
            height = initBoard.Length;
            width = initBoard[0].Length;
            board = initBoard;
            this.boatSizes = boatSizes;
        }
    }
}