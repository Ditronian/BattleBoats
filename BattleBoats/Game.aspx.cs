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
        protected void Page_Load(object sender, EventArgs e)
        {
            //Gate Keeper
            if (Session["userID"] == null) Response.Redirect("~/Login.aspx");
        }

        protected void newGameButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("Game.aspx");
        }

        protected void homeButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("Home.aspx");
        }
    }
}