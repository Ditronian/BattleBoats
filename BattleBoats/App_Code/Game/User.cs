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

        public int UserID { get => userID; set => userID = value; }
        public string Username { get => username; set => username = value; }
        public byte[] Password { get => password; set => password = value; }
        public int TotalGames { get => totalGames; set => totalGames = value; }
        public int GamesWon { get => gamesWon; set => gamesWon = value; }
        public int GamesLost { get => gamesLost; set => gamesLost = value; }
    }
}