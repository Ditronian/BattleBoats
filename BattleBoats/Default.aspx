<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="BattleBoats.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">


        <div id="headerDiv">
            <h1>Welcome to BattleBoats</h1>
            <h3>This page exists only to show off what ASP.Net can do.</h3>
        </div>


        <div id="postBackDiv">
            <span>This simple table showcases a postback.  Enter some text into the textbox and press the button.</span>
            <p></p>
            <span>Notice how the value entered is preserved in the textbox after the page reloads, and can be utilized by the server code to be displayed as output.</span>
            <p></p>
            <span>Without a 'postback' this value would not survive the reloading of the page, and it would be impossible to use it with server-side code.</span>
            <p></p>
            <table>
                <tr>
                    <td>Some Text: </td>
                    <td><asp:TextBox ID="myTextBox" runat="server"></asp:TextBox></td>
                </tr>
                <tr>
                    <td><asp:Button ID="postbackButton" runat="server" Text="Click Me" OnClick="postbackButton_Click" /></td>
                </tr>
            </table>
            <br />
            <asp:Label ID="resultLabel" runat="server" Text="Result: "></asp:Label>
        </div>
        <p></p>

        <div id="randomDiv">
            <table>
                <tr>
                    <td>Write stuff here</td>
                </tr>
                <tr>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                </tr>
            </table>
        </div>

    </form>
</body>
</html>
