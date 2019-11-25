using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BattleBoats
{
    public class User
    {
        private int userID;
        private string username;
        private Byte[] password;
        private int totalGames;
        private int gamesWon;
        private int gamesLost;

        public int UserID { get => UserID; set => UserID = value; }
        public string Username { get => Username; set => Username = value; }
        public byte[] Password { get => Password; set => Password = value; }
        public int TotalGames { get => TotalGames; set => TotalGames = value; }
        public int GamesWon { get => GamesWon; set => GamesWon = value; }
        public int GamesLost { get => GamesLost; set => GamesLost = value; }
    }
}