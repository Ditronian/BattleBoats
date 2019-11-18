﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="BattleBoats.Home" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>BattleBoats</title>
    <link rel="stylesheet" type="text/css" href="CSS/Home.css" />
</head>
<body>
    <form id="form1" runat="server">
        <H1>BattleBoats</H1>
        <div id="headerDiv">
            <asp:Label CssClass="headerLabel" runat="server" Text="Welcome, John Smith"></asp:Label>
            <asp:Button CssClass="headerBtn" runat="server" Text="Stats"></asp:Button>
            <asp:Button CssClass="headerBtn" runat="server" Text="Logout"></asp:Button>
        </div>
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
            <asp:Button id="playGameBtn" runat="server" Text="Play"></asp:Button>
        </div>
    </form>
</body>
</html>
