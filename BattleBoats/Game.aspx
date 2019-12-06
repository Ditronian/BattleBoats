<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Game.aspx.cs" Inherits="BattleBoats.Game" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="stylesheet" type="text/css" href="CSS/Game.css" />
    <link rel="stylesheet" type="text/css" href="CSS/Master.css" />
    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/4.5.2/1/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/4.5.2/1/MicrosoftAjaxWebForms.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <br />

        <div id="greaterDiv">
        <h2>Game Magic Goes Here!!!</h2>
            <div id="gamecontainer">
                <canvas id="gamecanvas" width="500" height="500">Does not support canvas</canvas>
                <br />
                <asp:ScriptManager ID="scriptManager" runat="server" EnablePageMethods="true" EnablePartialRendering="true" ScriptMode="Release">
                </asp:ScriptManager>
            </div>
            <br />
            <asp:Button ID="newGameButton" runat="server" Text="New Game" OnClick="newGameButton_Click" />
            <asp:Button ID="homeButton" runat="server" Text="Home" OnClick="homeButton_Click" />
        </div>

        <footer id="gameFooter">
            Five Armies Kevin MacLeod (incompetech.com)
            <br />
            Licensed under Creative Commons: By Attribution 3.0 License
            <br />
            http://creativecommons.org/licenses/by/3.0/
        </footer>
    </form>
    <script type="text/javascript" src="Javascripts/game.js"></script>
</body>
</html>