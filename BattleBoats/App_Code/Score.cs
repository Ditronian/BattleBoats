using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BattleBoats
{
    public class Score
    {
        private int ScoreID;
        private int Hits;
        private int Misses;
        private int EnemyShipsSunk;

        public int ScoreID1 { get => ScoreID; set => ScoreID = value; }
        public int Hits1 { get => Hits; set => Hits = value; }
        public int Misses1 { get => Misses; set => Misses = value; }
        public int EnemyShipsSunk1 { get => EnemyShipsSunk; set => EnemyShipsSunk = value; }
    }
}