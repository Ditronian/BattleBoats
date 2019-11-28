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

        //Handles User Login
        protected void ExistingUserButton_Click(object sender, EventArgs e)
        {
            //Make User Object
            User user = new User();
            user.Username = loginUsernameTextBox.Text;
            user.Password = Security.encrypt(loginPasswordTextBox.Text);

            //Authenticate User in Database
            UsersTable userTable = new UsersTable(new DataConnection());
            int userID = userTable.authenticateUser(user);

            //Login and save userID to session var
            if (userID != 0)
            {
                Session["UserID"] = userID;
                Response.Redirect("Home.aspx");
            }

            //Login failed message in a nonexistant label.
            else angryLoginLabel.Text = "Invalid Username and Password.";

        }

        //Handles User Registration and auto-login
        protected void RegisterButton_Click(object sender, EventArgs e)
        {
            //Password Confirmation
            if (registerPasswordTextBox.Text != confirmPasswordTextBox.Text)
            {
                angryRegisterLabel.Text = "The provided Passwords do not match.";
                return;
            }

            //Make User Object
            User user = new User();
            user.Username = registerUsernameTextBox.Text;
            user.Password = Security.encrypt(registerPasswordTextBox.Text);

            //Register User in Database, and check if name already taken.
            UsersTable userTable = new UsersTable(new DataConnection());
            if(userTable.checkUsername(user) == true)
            {
                angryRegisterLabel.Text = "A user with that username already exists.";
                return;
            }
            else userTable.insertUser(user);

            //Login and save userID to session var
            int userID = userTable.authenticateUser(user);
            if (userID != 0)
            {
                Session["UserID"] = userID;
                Response.Redirect("Home.aspx");
            }
            else angryRegisterLabel.Text = "An error has occured, it is Linda's fault.";
        }
    }
}