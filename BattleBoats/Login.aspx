<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="BattleBoats.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Login Page</title>
    <link rel="stylesheet" type="text/css" href="CSS/Login.css" />
</head>
<body>
    <form id="form1" runat="server">
        <div id="HeaderDiv">
            <h2>Welcome to</h2>
            <h1>BattleBoats!</h1>
        </div>
        <section id="LoginDivs">
            <div id="Registration">
                <h3>New User</h3>
                Username:
                <br />
                <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
                <br />
                Password:
                <br />
                <asp:TextBox ID="TextBox2" runat="server"></asp:TextBox>
                <br />
                Confirm Password:
                <br />
                <asp:TextBox ID="TextBox3" runat="server"></asp:TextBox>
                <br /><br />
                <asp:Button ID="RegisterButton" runat="server" Text="Continue" />
                <br /><br />
            </div>
            <div id="ExistingUser">

            </div>
        </section>
    </form>
</body>
</html>