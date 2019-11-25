using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BattleBoats
{
    public class Score
    {
        private int scoreID;
        private int hits;
        private int misses;
        private int enemyShipsSunk;
    
        public int ScoreID { get => scoreID; set => scoreID = value; }
        public int Hits { get => hits; set => hits = value; }
        public int Misses { get => misses; set => misses = value; }
        public int EnemyShipsSunk { get => enemyShipsSunk; set => enemyShipsSunk = value; }
    }
}