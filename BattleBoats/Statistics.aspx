<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Statistics.aspx.cs" Inherits="BattleBoats.Statistics" %>

<!DOCTYPE html>
<!-- Rider test linda -->

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="stylesheet" type="text/css" href="CSS/Master.css" />
    <link rel="stylesheet" type="text/css" href="CSS/Statistics.css" />
</head>
<body>

    <form id="form1" runat="server">
        <div id="outerDiv"><h1 id="header"><asp:Label ID = "nameLabelStats" CssClass = "headerLabel" runat = "server" Text = "'s STATISTICS"></asp:Label></h1> </div>
            
        <section id = "StatsDivs">
            <div id="LeftDiv">
                <h3> PLAYER STATS</h3>
                <asp:Label ID = "GamesPlayedLabel" Text = "Total Games Played: " runat="server"></asp:Label>
                 <p> </p>
                <asp:Label ID="WinLossLabel" runat="server" Text="Win Percentage: "></asp:Label>
                <p> </p>
                <asp:Label id = "TotalPointsLabel" Text = "Total Points: " runat="server"></asp:Label>
                <p></p>
                </div>

             <div id = "RightDiv">
                 <h3> LEADER BOARD</h3>
                 <table>
                    <tr>
                        <td> 1. </td>
                        <td> <asp:Label ID = "UserLabel1"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel1" runat="server"></asp:Label></td>
                    </tr>
                     <tr>
                        <td> 2. </td>
                        <td> <asp:Label ID = "UserLabel2"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel2" runat="server"></asp:Label></td>
                    </tr>
                     <tr>
                        <td> 3. </td>
                        <td> <asp:Label ID = "UserLabel3"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel3" runat="server"></asp:Label></td>
                    </tr>
                     <tr>
                        <td> 4. </td>
                        <td> <asp:Label ID = "UserLabel4"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel4" runat="server"></asp:Label></td>
                    </tr>
                     <tr>
                        <td> 5. </td>
                        <td> <asp:Label ID = "UserLabel5"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel5" runat="server"></asp:Label></td>
                    </tr>
                    
                     <tr>
                        <td> 6. </td>
                        <td> <asp:Label ID = "UserLabel6"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel6" runat="server"></asp:Label></td>
                    </tr>
                     <tr>
                        <td> 7. </td>
                        <td> <asp:Label ID = "UserLabel7"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel7" runat="server"></asp:Label></td>
                    </tr>
                     <tr>
                        <td> 8. </td>
                        <td> <asp:Label ID = "UserLabel8"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel8" runat="server"></asp:Label></td>
                    </tr>
                     <tr>
                        <td> 9. </td>
                        <td> <asp:Label ID = "UserLabel9"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel9" runat="server"></asp:Label></td>
                    </tr>
                     <tr>
                        <td> 10. </td>
                        <td> <asp:Label ID = "UserLabel10"  runat="server"></asp:Label> </td>
                        <td><asp:Label ID = "PointsLabel10" runat="server"></asp:Label></td>
                    </tr>
               </table>
            </div>
        </section>
        <br />
        <div id="buttonDiv">
                <asp:Button id = "HomeButton" runat="server" Text = "HOME" OnClick="HomeButton_Click"></asp:Button>
        </div>
    </form>
</body>
</html>
