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
                // Grab the user...
                User daUser = ((User) Session["User"]);
                DataConnection datC = new DataConnection();
                // Get the user win loss info...
                UsersTable usrTbl = new UsersTable(datC);
                usrTbl.getWinLoss(daUser);
                
                // Print other stuff
                ScoresTable scoreTable = new ScoresTable(datC);

                nameLabelStats.Text = daUser.Username + "'s STATISTICS";
                GamesPlayedLabel.Text = "Total Games Played: " + daUser.GamesWon;
                WinLossLabel.Text = "Win Percentage: " + (((double)daUser.GamesWon) / ((double)daUser.TotalGames)) * 100 + "%";
                TotalPointsLabel.Text = "Total Points: " + scoreTable.getGameScores(daUser);
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