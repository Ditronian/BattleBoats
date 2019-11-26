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
            User user = new User();
            user.Username = loginUsernameTextBox.Text;
            user.Password = Security.encrypt(loginPasswordTextBox.Text);

            //Awaiting hookup in database
            //UsersTable userTable = new UsersTable(new DataConnection());
            //int userID = userTable.authenticateUser(user);

            //if(userID != 0){Login and save userID to session var}


            Session["UserID"] = 3;
            Response.Redirect("Home.aspx");
        }

        protected void RegisterButton_Click(object sender, EventArgs e)
        {
            User user = new User();
            user.Username = registerUsernameTextBox.Text;
            user.Password = Security.encrypt(registerPasswordTextBox.Text);

            UsersTable userTable = new UsersTable(new DataConnection());
            //userTable.insertUser(user);


        }
    }
}