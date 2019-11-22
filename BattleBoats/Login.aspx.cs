using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BattleBoats
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            
        }

        protected void ExistingUserButton_Click(object sender, EventArgs e)
        {
            Session["UserID"] = 3;
            Response.Redirect("Home.aspx");
        }
    }
}