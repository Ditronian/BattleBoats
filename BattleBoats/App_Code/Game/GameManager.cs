using System;

namespace BattleBoats
{ 
    public class GameManager {
        public const int PLAYER1 = 0;
        public const int PLAYER2 = 1;
        private ScoreKeeper player1Score;
        private ScoreKeeper player2Score;
        private GameBoard player1Board;
        private GameBoard player2Board;
        private GameAI ai;
        private int currentPlayerMove;
        
        /**
         * Constructs a new game.
         */
        public GameManager(GameBoard p1, GameBoard p2) {
            // Both boards should have settings matching the global settings...
            player1Board = p1;
            player2Board = p2;
            player1Score = new ScoreKeeper();
            player2Score = new ScoreKeeper();

            currentPlayerMove = PLAYER1;
        }

        public int getCurrentPlayerMove() {
            return currentPlayerMove;
        }

        public bool playMove(int x, int y) {
            if (currentPlayerMove == PLAYER1)
            {
                currentPlayerMove = PLAYER2;
                bool wasHit = player2Board.attemptShot(x, y);
                player1Score.atempt(wasHit);
                if (wasHit) player2Score.shipSunk();
                return wasHit;
            }
            else
            {
                currentPlayerMove = PLAYER1;
                bool wasHit = player1Board.attemptShot(x, y);
                player2Score.atempt(wasHit);
                if(wasHit) player1Score.shipSunk();
                return wasHit;
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
                return new PlayerBoards(player1Board.getBoatArray(), player2Board.getHitArray(), player1Score);
            }
            else if(player == PLAYER2)
            {
                return new PlayerBoards(player2Board.getBoatArray(), player1Board.getHitArray(), player2Score);
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
        public ScoreKeeper scoreData;

        public PlayerBoards(SimpleBoard shipBoard, SimpleBoard hitBoard, ScoreKeeper scoreData)
        {
            this.shipBoard = shipBoard;
            this.hitBoard = hitBoard;
            this.scoreData = (ScoreKeeper)scoreData.Clone();
        }
    }

    // Adjust to change game settings...
    public class GameSettings
    {
        public int boardWidth = 10;
        public int boardHeight = 10;
        public int[] boatSizes = new int[]{2, 2, 3, 5};
    }


    /**
     * Helper class for keeping track of the users score...
     */
    public class ScoreKeeper: ICloneable
    {
        // Adjust for differing scores...
        public const int MAX_HIT_SCORE = 100;
        
        // Keeps track of everything needed for the score system
        public int score = 0;
        public int numHits = 0;
        public int numAttempts = 0;
        public int movesSinceLastHit = 0;
        public int shipsSunk = 0;

        public void atempt(bool wasHit)
        {
            numAttempts++;
            movesSinceLastHit++;
            if (wasHit)
            {
                score += (MAX_HIT_SCORE / movesSinceLastHit);
                movesSinceLastHit = 0;
                numHits++;
            }
        }

        public void shipSunk()
        {
            // Makes scoring worth half the current amount...
            shipsSunk++;
            movesSinceLastHit *= 2;
        }

        public object Clone()
        {
            ScoreKeeper obj = new ScoreKeeper();
            obj.score = score;
            obj.numHits = numHits;
            obj.numAttempts = numAttempts;
            obj.movesSinceLastHit = movesSinceLastHit;
            obj.shipsSunk = shipsSunk;
            return obj;
        }
    }
}