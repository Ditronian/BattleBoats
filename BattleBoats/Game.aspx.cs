using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;

namespace BattleBoats
{
    public partial class Game : System.Web.UI.Page
    {
        // Now the game manager handles game data...
        GameManager game;

        protected void Page_Load(object sender, EventArgs e)
        {
            //Gate Keeper
            if (Session["UserID"] == null) Response.Redirect("~/Login.aspx");

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
            Response.Redirect("Game.aspx");
        }

        //Gracefully handle game closure
        protected void homeButton_Click(object sender, EventArgs e)
        {
            if (Session["activeGame"] != null) Session.Remove("activeGame");
            Response.Redirect("Home.aspx");
        }



        //Obviously this is just here for testing purposes.  We can have it do something far more useful in actual usage.
        [WebMethod]
        public static User sayHi()
        {
            User user = new User();
            user.UserID = (int)HttpContext.Current.Session["UserID"];
            user.Username = "Bob the Builder";
            return user;
        }


    }
}