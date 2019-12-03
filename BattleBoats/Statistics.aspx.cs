using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BattleBoats
{
    public partial class Statistics : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //Gate Keeper
            if (Session["User"] == null) Response.Redirect("~/Login.aspx");
        }

        protected void HomeButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("Home.aspx");
        }
    }
}