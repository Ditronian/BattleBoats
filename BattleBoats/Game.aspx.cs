using System;
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

            //Check if AJAX PostBack
            if (scriptManager.IsInAsyncPostBack)
            {

                // partial (asynchronous) postback occured
                // insert Ajax custom logic here
            }
            //Check if this is a postback, and a game is active, if so handle the game
            else if (this.IsPostBack && Session["activeGame"] != null)
            {
                updateGame();
            }
            else startGame();


        }



        //Handles any thing needed from the server on Game Start
        private void startGame()
        {
            //Make the new Game and save it to the Session
            // New design, this isn't going to work... game = new GameManager();
            Session["activeGame"] = game;
        }


        //Do what is needed to pass information to the Javascript.
        private void updateGame()
        {
            //Load existing game state
            game = (GameManager)Session["activeGame"];

            //Get User Move from HiddenField that was updated by the JS with the player's move.
            int x = 0;
            int y = 0;

            //Send Player Move to the GameController where it can then decide on the AI's move, and update itself.
            // Yea not going to work... game.playerMove(x, y);

            //Save the updated Game State
            Session["activeGame"] = game;

            //Update the HiddenFields as needed so that the javascript can load the proper game state.
            //hiddenfield1 = game.getGameString();
        }


        protected void newGameButton_Click(object sender, EventArgs e)
        {
            Session.Remove("activeGame");
            Session.Remove("activeGame");
            Response.Redirect("Game.aspx");
        }

        //Gracefully handle game closure
        protected void homeButton_Click(object sender, EventArgs e)
        {
            if (Session["activeGame"] != null) Session.Remove("activeGame");
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
            GameBoard player1 = new GameBoard(gset.boardWidth, gset.boardHeight, gset.boatSizes, initBoard);
            
            // Make the AI board... Doesn't work yet as .buildBoard is not yet fully implemented...
            GameAI gai = new GameAI(gset);
            GameBoard aiGb = new GameBoard(gset.boardWidth, gset.boardHeight, gset.boatSizes, gai.buildBoard());
            // Build game manager from everything else...
            GameManager gm = new GameManager(player1, aiGb);

            HttpContext.Current.Session["game"] = gm;
            HttpContext.Current.Session["ai"] = gai;

            return gm.getPlayerData(GameManager.PLAYER1);
        }

        // Plays a move, accepting the player move and then performing the AI move...
        [WebMethod]
        public static PlayerBoards playMove(int x, int y)
        {
            GameManager gm = (GameManager) HttpContext.Current.Session["game"];
            GameAI ai = (GameAI) HttpContext.Current.Session["ai"];

            bool hit = gm.playMove(x, y);
            int[] aiGuess = ai.makeGuess();
            gm.playMove(aiGuess[0], aiGuess[1]);

            PlayerBoards playerData = gm.getPlayerData(GameManager.PLAYER1);
            playerData.aiHit = aiGuess;
            playerData.hitAShip = hit;
            playerData.gameOver = gm.gameOver();
            playerData.playerWins = gm.getWinner() == GameManager.PLAYER1;

            return playerData;
        }
    }
}