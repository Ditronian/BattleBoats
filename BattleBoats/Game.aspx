﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Game.aspx.cs" Inherits="BattleBoats.Game" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="stylesheet" type="text/css" href="CSS/Game.css" />
    <link rel="stylesheet" type="text/css" href="CSS/Master.css" />
</head>
<body>
    <form id="form1" runat="server">
        <div id="navDiv">
            <asp:Button ID="homeButton" runat="server" Text="Home" OnClick="homeButton_Click" />
        </div>
        <br />

        <div id="greaterDiv">
        <h2>Game Magic Goes Here!!!</h2>
            <div id="gamecontainer">
                <asp:ScriptManager ID="scriptManager" runat="server"></asp:ScriptManager>
                <asp:UpdatePanel ID="ajaxCanvas" runat="server" updatemode="Conditional">
                    <Triggers>
                        <asp:AsyncPostBackTrigger controlid="Button1" eventname="Click" />
                    </Triggers>
                    <ContentTemplate>
                        <canvas id="gamecanvas" width="500" height="500">Does not support canvas</canvas>
                        <asp:Button ID="Button1" runat="server" Text="AJAX Button" OnClick="Button1_Click" />
                        <asp:Label ID="Label1" runat="server" Text=""></asp:Label>
                    </ContentTemplate>
                </asp:UpdatePanel>
            </div>

            <br />
            <asp:Button ID="Button2" runat="server" Text="Button" />
            <asp:Button ID="newGameButton" runat="server" Text="New Game" OnClick="newGameButton_Click" />
        </div>
        <asp:HiddenField ID="shootLocationHiddenField" runat="server" />
        <asp:HiddenField ID="aiHiddenField" runat="server" />
        <asp:HiddenField ID="playerHiddenField" runat="server" />
        <asp:HiddenField ID="winLoseHiddenField" runat="server" />
    </form>
    <script type="text/javascript" src="Javascripts/game.js"></script>
</body>
</html>
