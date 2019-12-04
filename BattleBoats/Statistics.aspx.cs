using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.SqlServer.Server;

namespace BattleBoats
{
    public partial class Statistics : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //Gate Keeper
            if (Session["User"] == null) Response.Redirect("~/Login.aspx");
            else
            {
                nameLabelStats.Text =((User)Session["User"]).Username + "'s STATISTICS";
                GamesPlayedLabel.Text = "Total Games Played: " + ((User) Session["User"]).GamesWon;
                WinLossLabel.Text = "Win/Loss Ratio: " + (double) ((User) Session["User"]).GamesWon /
                                    (double) ((User) Session["User"]).GamesLost;
                TotalPointsLabel.Text = "Total Points: " ;
            }
        }

        protected void TotalScore(Score score)
        {
            
        }

        protected void HomeButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("Home.aspx");
        }
    }
}