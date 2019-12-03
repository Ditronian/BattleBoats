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
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Hits", score.Hits);
            parameters[1] = new SqlParameter("Misses", score.Misses);
            parameters[2] = new SqlParameter("EnemyShipsSunk", score.EnemyShipsSunk);
            parameters[3] = new SqlParameter("GameScore", score.GameScore);
                            
            database.uploadCommand(query, parameters);
                
        }

        public List<Score> getAllScores(Score score)
        {
            string query = "spGetAllScores";
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("UserID", score.UserID);

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

       

    }
}