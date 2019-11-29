using System;

namespace BattleBoats
{ 
    public class GameManager
    {
        public const int PLAYER1 = 0;
        public const int PLAYER2 = 1;
        private GameBoard player1Board;
        private GameBoard player2Board;
        private GameAI ai;
        private int currentPlayerMove;
        
        /**
         * Constructs a new game.
         */
        public GameManager(GameBoard p1, GameBoard p2)
        {
            // Both boards should have settings matching the global settings...
            player1Board = p1;
            player2Board = p2;

            currentPlayerMove = PLAYER1;
        }

        public int getCurrentPlayerMove()
        {
            return currentPlayerMove;
        }

        public bool playMove(int x, int y)
        {
            if (currentPlayerMove == PLAYER1)
            {
                currentPlayerMove = PLAYER2;
                return player2Board.attemptShot(x, y);
            }
            else
            {
                currentPlayerMove = PLAYER1;
                return player1Board.attemptShot(x, y);
            }
        }

        /**
         * Returns JSON representation of player data, containing both the board informing the user of there own board,
         * and the board informing them where they have hit the other player's board...
         */
        public PlayerBoards getPlayerData(int player)
        {
            if (player == PLAYER1)
            {
                return new PlayerBoards(player1Board.getBoatArray(), player2Board.getHitArray());
            }
            else if(player == PLAYER2)
            {
                return new PlayerBoards(player2Board.getBoatArray(), player1Board.getHitArray());
            }
            else
            {
                throw new ArgumentException("What are you doing???");
            }
        }
    }

    public class PlayerBoards
    {
        public SimpleBoard shipBoard;
        public SimpleBoard hitBoard;

        public PlayerBoards(SimpleBoard shipBoard, SimpleBoard hitBoard)
        {
            this.shipBoard = shipBoard;
            this.hitBoard = hitBoard;
        }
    }

    // Adjust to change game settings...
    public class GameSettings
    {
        public int boardWidth = 10;
        public int boardHeight = 10;
        public int[] boatSizes = new int[]{2, 2, 3, 5};
    }
}