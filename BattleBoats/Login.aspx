<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="BattleBoats.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Login Page</title>
    <link rel="stylesheet" type="text/css" href="CSS/Master.css" />
    <link rel="stylesheet" type="text/css" href="CSS/Login.css" />
</head>
<body style="">
    <form id="form1" runat="server">
        <div id="HeaderDiv">
            <h2>WELCOME TO</h2>
            <h1>BATTLEBOATS!</h1>
        </div>
        <section id="LoginDivs">
            <div id="Registration">
                <h2>New User</h2>
                Username:
                <br />
                <asp:TextBox ID="usernameTextBox" runat="server"></asp:TextBox>
                <br />
                Password:
                <br />
                <asp:TextBox ID="passwordTextBox" runat="server"></asp:TextBox>
                <br />
                Confirm Password:
                <br />
                <asp:TextBox ID="confirmPasswordTextBox" runat="server"></asp:TextBox>
                <br /><br />
                <asp:Button ID="RegisterButton" runat="server" Text="Continue" OnClick="RegisterButton_Click"/>
                <br /><br />
            </div>
            <div id="ExistingUser">
                <h2>Existing User</h2>
                Username:
                <br />
                <asp:TextBox ID="TextBox4" runat="server"></asp:TextBox>
                <br />
                Password:
                <br />
                <asp:TextBox ID="TextBox5" runat="server"></asp:TextBox>
                <br /><br />
                <asp:Button ID="ExistingUserButton" runat="server" Text="Continue" OnClick="ExistingUserButton_Click" />
            </div>
        </section>
        <div id="Creators">
            <h4>
                Game Creators:
            </h4>
                David Gereau
                <br />
                Isaac Robinson
                <br />
                Linda Schimming
                <br />
                Emily Martin
                <br />
        </div>
    </form>
</body>
</html>