using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BattleBoats
{
    public class UsersTable
    {
        protected DataConnection database;
        
        public UsersTable(DataConnection database)
        {
            this.database = database;
        }

        public void insertUser(User user)
        {
            string query = "spInsertUser";
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("Username", user.Username);
            parameters[1] = new SqlParameter("Password", user.Password);
            
            database.uploadCommand(query, parameters);

        }

        public int authenticateUser(User user)
        {
            string query = "spAuthenticateUser";
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("Username", user.Username);
            parameters[1] = new SqlParameter("Password", user.Password);

            DataSet data = database.downloadCommand(query, parameters);

            if (data.Tables[0].Rows.Count == 1)
            {
                return (Int32) data.Tables[0].Rows[0]["UserID"];
            }
            else
            {
                return 0;
            }
        }

        public void updateYoSelf(User user)
        {
            string query = "spUpdateUser";
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("UserID", user.UserID);
            parameters[1] = new SqlParameter("GamesWon", user.GamesWon);
            parameters[2] = new SqlParameter("TotalGames", user.TotalGames);
            parameters[3] = new SqlParameter("GamesLost", user.GamesLost);
            
            
            database.uploadCommand(query, parameters);
        }

        public void deleteYoSelf(User user)
        {
            string query = "spDeleteUser";
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("UserID", user.UserID);
            
            database.uploadCommand(query, parameters);
            
        }
        
    }
}