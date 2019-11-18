<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="BattleBoats.Home" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
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
            <a href="Game.aspx">Play Game</a>
        </div>
    </form>
</body>
</html>
