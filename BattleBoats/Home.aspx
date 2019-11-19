<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="BattleBoats.Home" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>BattleBoats</title>
    <link rel="stylesheet" type="text/css" href="CSS/Master.css" />
    <link rel="stylesheet" type="text/css" href="CSS/Home.css" />
</head>
<body>
    <form id="form1" runat="server">
        <h1>BattleBoats</h1>
        <div id="headerDiv">
            <div id="hDiv1"></div>
            <div id="hDiv2"><h3><asp:Label CssClass="headerLabel" runat="server" Text="Welcome, John Smith"></asp:Label></h3></div>
            <div id="hDiv3">
                <div id="headerBtns">
                    <asp:Button id="statsButton" CssClass="headerBtn" runat="server" Text="Stats" OnClick="statsButton_Click"></asp:Button>
                    <asp:Button id="logoutButton" CssClass="headerBtn" runat="server" Text="Logout" OnClick="logoutButton_Click"></asp:Button>
                </div>
            </div>
        </div>
        <p></p>
        <div id="bodyDiv">
            <p class="subheader">Goal: </p>
            <ul>
                <li>Sink opponents ships</li>
            </ul>
            <p class="subheader">Setup: </p>
            <ul>
                <li>Place your ship on the battle grid.</li>
            </ul>
            <p class="subheader">Rules: </p>
            <ul>
                <li>Take turns firing shots by selecting a coordinate on opponents grid</li>
                <li>Cell will turn red if hit, White if missed.</li>
                <li>Player wins when all of ships coordinates are hit. </li>
            </ul>
            <asp:Button id="playGameBtn" runat="server" Text="Play" OnClick="playGameBtn_Click1"></asp:Button>
            <p></p>
        </div>
    </form>
</body>
</html>
