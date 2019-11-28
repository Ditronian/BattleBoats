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
                <asp:TextBox ID="registerUsernameTextBox" runat="server"></asp:TextBox>
                <br />
                <asp:RequiredFieldValidator ID="registerUserFieldValidator" ForeColor="Red" runat="server" ErrorMessage="This field is required." ControlToValidate="registerUsernameTextBox" ValidationGroup="validateRegister"></asp:RequiredFieldValidator>
                <br />
                Password:
                <br />
                <asp:TextBox ID="registerPasswordTextBox" runat="server" TextMode="Password"></asp:TextBox>
                <br />
                <asp:RequiredFieldValidator ID="registerPasswordFieldValidator" ForeColor="Red" runat="server" ErrorMessage="This field is required." ControlToValidate="registerPasswordTextBox" ValidationGroup="validateRegister"></asp:RequiredFieldValidator>
                <br />
                Confirm Password:
                <br />
                <asp:TextBox ID="confirmPasswordTextBox" runat="server" TextMode="Password"></asp:TextBox>
                <br />
                <asp:RequiredFieldValidator ID="confirmPasswordFieldValidator" ForeColor="Red" runat="server" ErrorMessage="This field is required." ControlToValidate="confirmPasswordTextBox" ValidationGroup="validateRegister"></asp:RequiredFieldValidator>
                <br />
                <asp:Button ID="RegisterButton" runat="server" Text="Continue" ValidationGroup="validateRegister" OnClick="RegisterButton_Click"/>
                <p></p>
                <asp:Label ID="angryRegisterLabel" runat="server" Text="" ForeColor="Red"></asp:Label>
            </div>
            <div id="ExistingUser">
                <h2>Existing User</h2>
                Username:
                <br />
                <asp:TextBox ID="loginUsernameTextBox" runat="server"></asp:TextBox>
                <br />
                <asp:RequiredFieldValidator ID="loginUserFieldValidator" ForeColor="Red" runat="server" ErrorMessage="This field is required." ControlToValidate="loginUsernameTextBox" ValidationGroup="validateLogin"></asp:RequiredFieldValidator>
                <br />
                Password:
                <br />
                <asp:TextBox ID="loginPasswordTextBox" runat="server" TextMode="Password"></asp:TextBox>
                <br />
                <asp:RequiredFieldValidator ID="loginPasswordFieldValidator" ForeColor="Red" runat="server" ErrorMessage="This field is required." ControlToValidate="loginPasswordTextBox" ValidationGroup="validateLogin"></asp:RequiredFieldValidator>
                <br />
                <asp:Button ID="ExistingUserButton" runat="server" Text="Continue" ValidationGroup="validateLogin" OnClick="ExistingUserButton_Click" />
                <p></p>
                <asp:Label ID="angryLoginLabel" runat="server" Text="" ForeColor="Red"></asp:Label>
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