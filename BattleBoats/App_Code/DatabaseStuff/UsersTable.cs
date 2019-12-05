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

        public User authenticateUser(User user)
        {
            string query = "spAuthenticateUser";
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("Username", user.Username);
            parameters[1] = new SqlParameter("Password", user.Password);

            DataSet data = database.downloadCommand(query, parameters);

            if (data.Tables[0].Rows.Count == 1)
            {
                user.UserID = (Int32)data.Tables[0].Rows[0]["UserID"];
                user.Username = (string)data.Tables[0].Rows[0]["Username"];
                return user;
            }
            else
            {
                user.UserID = 0;
                return user;
            }
        }

        public User getWinLoss(User user) 
        {
            string query = "spGetWinLoss";
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("UserID", user.UserID);
           

            DataSet data = database.downloadCommand(query, parameters);
            
            user.GamesWon = (Int32) ((data.Tables[0].Rows[0]["GamesWon"] != null)? data.Tables[0].Rows[0]["GamesWon"]: 0);
            user.GamesLost = (Int32) ((data.Tables[0].Rows[0]["GamesLost"] != null)? data.Tables[0].Rows[0]["GamesLost"]: 0);
            
            return user;
        }

        public bool checkUsername(User user)
        {
            string query = "spCheckUsername";
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("Username", user.Username);

            DataSet data = database.downloadCommand(query, parameters);

            if (data.Tables[0].Rows.Count != 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public void updateYoSelf(User user)
        {
            string query = "spUpdateUser";
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("UserID", user.UserID);
            parameters[1] = new SqlParameter("GamesWon", user.GamesWon);
            parameters[2] = new SqlParameter("GamesLost", user.GamesLost);
            
            
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