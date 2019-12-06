using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.SqlServer.Server;

namespace BattleBoats
{
    public partial class Statistics : System.Web.UI.Page
    {
        
        protected Label[] highNameLabels;
        protected Label[] highScoreLabels;
        
        protected void Page_Load(object sender, EventArgs e)
        {
            //Gate Keeper
            if (Session["User"] == null) Response.Redirect("~/Login.aspx");
            else
            {
                // Construct label lists if not already created...
                if (highNameLabels == null)
                {
                    highNameLabels = new Label[]
                    {
                        UserLabel1, UserLabel2, UserLabel3, UserLabel4, UserLabel5, UserLabel6, UserLabel7, UserLabel8,
                        UserLabel9, UserLabel10
                    };
                    highScoreLabels = new Label[]
                    {
                        PointsLabel1, PointsLabel2, PointsLabel3, PointsLabel4, PointsLabel5, PointsLabel7,
                        PointsLabel8, PointsLabel9, PointsLabel10
                    };
                }
                
                // Grab the user...
                User daUser = ((User) Session["User"]);
                DataConnection datC = new DataConnection();
                // Get the user win loss info...
                UsersTable usrTbl = new UsersTable(datC);
                usrTbl.getWinLoss(daUser);
                
                // Print other stuff
                ScoresTable scoreTable = new ScoresTable(datC);
                
                string percentMsg = (daUser.TotalGames != 0)? (((double)daUser.GamesWon) / ((double)daUser.TotalGames)) * 100 + "%": "No games played...";

                nameLabelStats.Text = daUser.Username + "'s STATISTICS";
                GamesPlayedLabel.Text = "Total Games Played: " + daUser.GamesWon;
                WinLossLabel.Text = "Win Percentage: " + percentMsg;
                TotalPointsLabel.Text = "Total Points: " + scoreTable.getGameScores(daUser);
                
                // Print the high scores...
                KeyValuePair<string, int>[] highScores = scoreTable.getHighScores(highNameLabels.Length);
                for (int i = 0; i < highScores.Length; i++)
                {
                    highNameLabels[i].Text = highScores[i].Key;
                    highScoreLabels[i].Text = highScores[i].Value.ToString();
                }
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