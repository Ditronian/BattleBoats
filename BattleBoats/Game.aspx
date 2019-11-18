<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Game.aspx.cs" Inherits="BattleBoats.Game" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body style="width: 100%; height: 100%;">
    <form id="form1" runat="server">
        <h1>Game Magic Goes Here!!!</h1>
        <div id="gamecontainer">
            <canvas id="gamecanvas" style="height: 100%; width:  100%;">Does not support canvas</canvas>
        </div>
    </form>
    <script type="text/javascript" src="Javascripts/game.js"></script>
</body>
</html>
