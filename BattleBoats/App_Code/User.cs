using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BattleBoats.App_Code
{
    public class User
    {
        private int UserID;
        private string Username;
        private Byte[] Password;
        private int TotalGames;
        private int GamesWon;
        private int GamesLost;

        public int UserID1 { get => UserID; set => UserID = value; }
        public string Username1 { get => Username; set => Username = value; }
        public byte[] Password1 { get => Password; set => Password = value; }
        public int TotalGames1 { get => TotalGames; set => TotalGames = value; }
        public int GamesWon1 { get => GamesWon; set => GamesWon = value; }
        public int GamesLost1 { get => GamesLost; set => GamesLost = value; }
    }
}