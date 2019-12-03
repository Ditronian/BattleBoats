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
            if (Session["User"] == null) Response.Redirect("~/Login.aspx");
            else nameLabel.Text = "Welcome, " + ((User)Session["User"]).Username;
        }


        protected void statsButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("Statistics.aspx");
        }

        protected void logoutButton_Click(object sender, EventArgs e)
        {
            Session.Clear();
            Response.Redirect("Login.aspx");
        }

        protected void playGameBtn_Click1(object sender, EventArgs e)
        {
            Response.Redirect("Game.aspx");
        }
    }
}