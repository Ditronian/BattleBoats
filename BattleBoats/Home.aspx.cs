using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BattleBoats
{
    public partial class Home : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //Gate Keeper
            if (Session["userID"] == null) Response.Redirect("~/Login.aspx");
        }


        protected void statsButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("Statistics.aspx");
        }

        protected void logoutButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("Login.aspx");
        }

        protected void playGameBtn_Click1(object sender, EventArgs e)
        {
            Response.Redirect("Game.aspx");
        }
    }
}