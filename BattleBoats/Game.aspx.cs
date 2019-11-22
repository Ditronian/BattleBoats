using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BattleBoats
{
    public partial class Game : System.Web.UI.Page
    {
        GameController game;

        protected void Page_Load(object sender, EventArgs e)
        {
            //Gate Keeper
            if (Session["UserID"] == null) Response.Redirect("~/Login.aspx");

            //Check if this is a postback, and a game is active, if so handle the game
            if (this.IsPostBack && Session["activeGame"] != null) updateGame();
        }

        //Do what is needed to pass information to the Javascript.
        private void updateGame()
        {
            //Load existing game state
            game = (GameController) Session["activeGame"];

            //Get User Move from HiddenField that was updated by the JS with the player's move.
            int x = 0;
            int y = 0;

            //Send Player Move to the GameController where it can then decide on the AI's move, and update itself.
            game.playerMove(x, y);

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

        protected void homeButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("Home.aspx");
        }
    }
}