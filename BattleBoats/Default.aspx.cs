using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BattleBoats
{
    //This is a codebehind file, each .aspx (Web Form) page has one.
    public partial class Default : System.Web.UI.Page
    {
        /*
        Postbacks VS Initial Loading

            Initial Loading:
            Occurs when the user first loads a webpage from an external link, or something like Response.Redirect("Default.aspx");

            Postbacks:
            Postbacks are like partial loading of a page, ie if a user is filling out a form and presses a button, the button will need to send
            information to a server (ie this file), and then return a result to the screen.  Where this differs from a fresh page load, is in 
            the fact that the postback will preserve SOME of the user's changes to the web form, ie Clicking a button doesnt erase textboxes 
            filled out by the user.

            Neither Server or Javascript Variables survive postbacks!  There are several ways to get around this however depending on the situation.
            //Session Variables (Secure), Cookies (Insecure), POST/GET (1000% insecure)
        
        Order of Code Execution:
        There are a ton of different things happening during the loading of a page (postback or initial), and many of them are hidden from the developer
        but here is the basic order of events that occur.  RESPECT THE ORDER, the flow of web code is not the same as a desktop application.

        1. HTML tags in the .aspx are made available to the server (here) so they can be modified.
        2. Page_Load method is called (see below)
        3. If this is a postback, any saved information is propogated to the new page.
        4. If this is a postback, any event handler method (ie a button's handler) is called.
        5. Page_PreRender method is called (see below)
        6. Everything in the .aspx file and generated here in the CodeBehind, is loaded on the User's machine, to include javascript.
        */


        //This is a default method that comes with every codebehind, and is used to execute code during the loading of the page (initial OR postback)
        protected void Page_Load(object sender, EventArgs e)
        {
            if (this.IsPostBack)
            {
                //Do code only meant to happen on a postback
            }
            //etc
        }

        //This is another default method, but you must add it yourself to the codebehind if you want it.
        //Code placed here occurs at the moment before everything is rendered to the user as HTML.
        protected void Page_PreRender(object sender, EventArgs e)
        {

        }

        //This is our button's event handler it can access saved postback information, and use it to do stuff before a page finishes rendering.
        //In this case it will simply display the user's textbox input as output in a label.
        protected void postbackButton_Click(object sender, EventArgs e)
        {
            resultLabel.Text += myTextBox.Text;
        }
    }
}
