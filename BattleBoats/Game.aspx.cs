using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Services;

namespace BattleBoats {
    public partial class Game : System.Web.UI.Page
    {
        // Now the game manager handles game data...
        GameManager game;

        protected void Page_Load(object sender, EventArgs e)
        {
            //Gate Keeper
            if (Session["User"] == null) Response.Redirect("~/Login.aspx");
        }

        // If the user requests an new game, delete the old game and redirect...
        protected void newGameButton_Click(object sender, EventArgs e)
        {
            if (Session["game"] != null) Session.Remove("game");
            if (Session["ai"] != null) Session.Remove("ai");
            Response.Redirect("Game.aspx");
        }

        //Gracefully handle game closure
        protected void homeButton_Click(object sender, EventArgs e)
        {
            if (Session["game"] != null) Session.Remove("game");
            if (Session["ai"] != null) Session.Remove("ai");
            Response.Redirect("Home.aspx");
        }
        
        // Some example stuff I will try to link into JS...
        [WebMethod]
        public static GameSettings getSettings()
        {
            return new GameSettings();
        }
        
        // Initializes the game, building the new game object...
        [WebMethod]
        public static PlayerBoards initGame(int[] initBoard)
        {
            // Make the player board... TODO: Add try-catch which will auto-lose the game. (Player was cheating)
            GameSettings gset = new GameSettings();
            GameBoard player1;
            try
            {
                player1 = new GameBoard(gset.boardWidth, gset.boardHeight, gset.boatSizes, initBoard);
            }
            catch (ArgumentException e)
            {
                // We have a evil user who decided it was a good idea to try to submit a board which didn't match
                // the settings we sent to the front end, auto lose the game and rethrow the error so JS knows 
                // something went bad...
                
                // Some win/loss entry which does not exist yet... bla bla bla
                //ScoresTable scoreTable = new ScoresTable(new DataConnection());
                // scoreTable.insertScore(myNewScore);
                throw new ArgumentException("CHEATER!!!!!");
            }
            
            // Make the AI board...
            GameAI gai = new GameAI(gset);
            GameBoard aiGb = new GameBoard(gset.boardWidth, gset.boardHeight, gset.boatSizes, gai.buildBoard());
            // Build game manager from everything else...
            GameManager gm = new GameManager(player1, aiGb);
            // Add the new game and game settings to the session... 
            HttpContext.Current.Session["game"] = gm;
            HttpContext.Current.Session["ai"] = gai;
            // Return the player's data...
            return gm.getPlayerData(GameManager.PLAYER1);
        }

        // Plays a move, accepting the player move and then performing the AI move...
        [WebMethod]
        public static PlayerBoards playMove(int x, int y)
        {
            // Get the game manager and ai...
            GameManager gm = (GameManager) HttpContext.Current.Session["game"];
            GameAI ai = (GameAI) HttpContext.Current.Session["ai"];
            // Play the players hit, and store the result of whether it was a hit or a miss....
            bool hit = gm.playMove(x, y);
            // Get the AI's move, and apply it to the board...
            int[] aiGuess = ai.makeGuess();
            gm.playMove(aiGuess[0], aiGuess[1]);

            // Create PlayerBoards object to store player data to be sent the the JS frontend...
            PlayerBoards playerData = gm.getPlayerData(GameManager.PLAYER1);
            playerData.aiHit = aiGuess;
            playerData.hitAShip = hit;
            playerData.gameOver = gm.gameOver();
            playerData.playerWins = gm.getWinner() == GameManager.PLAYER1;
            
            // If the game is over, submit score to database and delete the current game so JS frontend can't continue
            // to submit attack commands...
            if (playerData.gameOver)
            {
                User usr = (User) HttpContext.Current.Session["User"];
                
                ScoresTable scoreTable = new ScoresTable(new DataConnection());
                
                Score score = new Score();
                score.Hits = playerData.scoreData.numHits;
                score.Misses = playerData.scoreData.numAttempts - playerData.scoreData.numHits;
                score.GameScore = playerData.scoreData.score;
                score.EnemyShipsSunk = getShipsSunk(playerData.shipBoard);
                score.UserID = usr.UserID;
                
                scoreTable.insertScores(score);
                HttpContext.Current.Session.Remove("game");
                HttpContext.Current.Session.Remove("ai");
            }
            
            // Send the JS frontend the player data...
            return playerData;
        }
        
        // Utility method used by above to compute how many ships were sunk....
        private static int getShipsSunk(SimpleBoard sb) {
            HashSet<int> sunkIDs = new HashSet<int>();
            
            foreach (int id in sb.data)
            {
                if (id < 0)
                {
                    sunkIDs.Add(id);
                }
            }
            foreach (int id in sb.data)
            {
                if (id > 0)
                {
                    sunkIDs.Remove(-id);
                }
            }
            
            return sunkIDs.Count;
        }
    }
}