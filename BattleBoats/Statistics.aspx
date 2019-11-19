<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Statistics.aspx.cs" Inherits="BattleBoats.Statistics" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
             <asp:Label ID = "GamesPlayedLabel" Text = "Total Games Played: " runat="server"></asp:Label>
                 <p> </p>
                <asp:Label ID="WinLossLabel" runat="server" Text="Win/Loss Ratio: "></asp:Label>
                <p> </p>
                <asp:Label id = "TotalPointsLabel" Text = "Total Points: " runat="server"></asp:Label>
               <table>
                    <tr>
                        <td> 1. </td>
                        <td> <asp:Label ID = "UserLabel1"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel1" runat="server"></asp:Label></td>
                    </tr>
               </table>
        </div>
    </form>
</body>
</html>
