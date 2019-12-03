using System;

namespace BattleBoats
{ 
    public class GameManager {
        // Integer consant IDs which represent the players...
        public const int PLAYER1 = 0;
        public const int PLAYER2 = 1;
        // Score keepers and game boards for both players...
        private ScoreKeeper player1Score;
        private ScoreKeeper player2Score;
        private GameBoard player1Board;
        private GameBoard player2Board;
        // Stores the integer ID of the next player who gets to attack next...
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
        
        /**
         * Get if the current game is over....
         */
        public bool gameOver()
        {
            return player1Board.allShipsDestroyed() || player2Board.allShipsDestroyed();
        }
        
        /**
         * Return the Integer ID of the player who won the game....
         */
        public int getWinner()
        {
            if (player2Board.allShipsDestroyed())
            {
                return PLAYER1;
            }
            else if(player1Board.allShipsDestroyed())
            {
                return PLAYER2;
            }
            return -1;
        }
    }
}