using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BattleBoats
{
    public class ScoresTable
    {
        protected DataConnection database;
                
        public ScoresTable(DataConnection database) {
            this.database = database;
        }
        public void insertScores(Score score) {
            string query = "spInsertScores";
            SqlParameter[] parameters = new SqlParameter[5];
            parameters[0] = new SqlParameter("Hits", score.Hits);
            parameters[1] = new SqlParameter("Misses", score.Misses);
            parameters[2] = new SqlParameter("EnemyShipsSunk", score.EnemyShipsSunk);
            parameters[3] = new SqlParameter("GameScore", score.GameScore);
            parameters[4] = new SqlParameter("UserID", score.UserID);
                            
            database.uploadCommand(query, parameters);
                
        }

        public List<Score> getAllScores(User user)
        {
            string query = "spGetAllScores";
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("UserID", user.UserID);

            DataSet data = database.downloadCommand(query, parameters);

            List<Score> scores = new List<Score>();

            for (int i = 0; i < data.Tables[0].Rows.Count; i++)
            {
                int ScoreID = (Int32) data.Tables[0].Rows[i]["ScoreID"];
                int Hits = (Int32) data.Tables[0].Rows[i]["Hits"];
                int Misses = (Int32) data.Tables[0].Rows[i]["Misses"];
                int EnemyShipsSunk = (Int32) data.Tables[0].Rows[i]["EnemyShipsSunk"];
                int GameScore = (Int32) data.Tables[0].Rows[i]["GameScore"];

                Score myScore = new Score();
                myScore.ScoreID = ScoreID;
                myScore.Hits = Hits;
                myScore.Misses = Misses;
                myScore.EnemyShipsSunk = EnemyShipsSunk;
                myScore.GameScore = GameScore;
                
                scores.Add(myScore);
            }

            return scores;
        }

        public int getGameScores(User user)
        {
            string query = "spUserScore";
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("UserID", user.UserID);

            DataSet data = database.downloadCommand(query, parameters);

            int result;

            try { result = (Int32)data.Tables[0].Rows[0]["total"]; }

            catch (InvalidCastException)
            {
                result = 0;
            }

            return result;
        }
        
        public KeyValuePair<string, int>[] getHighScores(int amount = 10) {
            string query = "spGetHighScores";
            DataSet data = database.downloadCommand(query, null);
            int endAt = (amount < data.Tables[0].Rows.Count)? amount : data.Tables[0].Rows.Count;
            KeyValuePair<string, int>[] highScores = new KeyValuePair<string, int>[endAt];

            for (int i = 0; i < endAt; i++)
            {
                highScores[i] = new KeyValuePair<string, int>(HttpUtility.HtmlEncode(data.Tables[0].Rows[i]["Username"].ToString()), 
                               (int)data.Tables[0].Rows[i]["result"]);
            }

            return highScores;
        }
    }
}