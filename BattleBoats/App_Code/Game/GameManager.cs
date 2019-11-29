using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BattleBoats
{
    public class GameManager
    {
        public const int PLAYER1 = 0;
        public const int PLAYER2 = 1;
        private GameBoard player1Board;
        private GameBoard player2Board;
        private GameController player1;
        private GameController player2;
        private int currentPlayerMove;
        
        /**
         * Constructs a new game.
         */
        public GameManager(GameController p1, GameController p2, int w, int h, int[] boatSizes)
        {
            player1 = p1;
            player2 = p2;

            player1Board = new GameBoard(w, h, boatSizes, player1.plotShips(w, h, boatSizes));
            player2Board = new GameBoard(w, h, boatSizes, player2.plotShips(w, h, boatSizes));

            currentPlayerMove = PLAYER1;
        }

        public int getCurrentPlayerMove()
        {
            return currentPlayerMove;
        }

        public bool playMove()
        {
            if (currentPlayerMove == PLAYER1)
            {
                Coordinate c = player1.playMove(getPlayerData(currentPlayerMove));
                currentPlayerMove = PLAYER2;
                return player2Board.attemptShot(c.x, c.y);
            }
            else
            {
                Coordinate c = player2.playMove(getPlayerData(currentPlayerMove));
                currentPlayerMove = PLAYER1;
                return player1Board.attemptShot(c.x, c.y);
            }
        }

        /**
         * Returns JSON representation of player data, containing both the board informing the user of there own board,
         * and the board informing them where they have hit the other player's board...
         */
        public string getPlayerData(int player)
        {
            if (player == PLAYER1)
            {
                return "{ board: " + player1Board.getBoatArray() + ", hitboard: " + player2Board.getHitArray() + "}";
            }
            else if(player == PLAYER2)
            {
                return "{ board: " + player2Board.getBoatArray() + ", hitboard: " + player1Board.getHitArray() + "}";
            }
            else
            {
                throw new ArgumentException("What are you doing???");
            }
        }
    }
}