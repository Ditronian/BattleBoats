using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BattleBoats
{
    public class Score
    {
        private int userID;
        private int scoreID;
        private int hits;
        private int misses;
        private int enemyShipsSunk;
        private int gameScore;
        
        public int UserID
        {
            get => userID;
            set => userID = value;
        }
        public int ScoreID { get => scoreID; set => scoreID = value; }
        public int Hits { get => hits; set => hits = value; }
        public int Misses { get => misses; set => misses = value; }
        public int EnemyShipsSunk { get => enemyShipsSunk; set => enemyShipsSunk = value; }

        public int GameScore
        {
            get => gameScore;
            set => gameScore = value;
        }
    }
}