using System;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data;

namespace BattleBoats
{
    public class DataConnection
    {
        SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["ConnectionString"].ToString());

        public void uploadCommand(string query, SqlParameter[] parameters = null)
        {
            sqlConnection.Open();
            
            SqlCommand cmd = new SqlCommand(query);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Connection = sqlConnection;
            if (parameters != null)
            {
                cmd.Parameters.AddRange(parameters);
            }

            cmd.ExecuteNonQuery();
            sqlConnection.Close();
        }

        public int uploadAndReturnCommand(string query, SqlParameter outputVal, SqlParameter[] parameters = null)
        {
            sqlConnection.Open();

            int outputID = -5;
            
            SqlCommand cmd = new SqlCommand(query);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Connection = sqlConnection;

            if (parameters != null)
            {
                cmd.Parameters.AddRange(parameters);
            }

            cmd.Parameters.Add(outputVal);

            cmd.ExecuteNonQuery();
            
            sqlConnection.Close();

            if (outputVal.Value != DBNull.Value)
            {
                outputID = Convert.ToInt32(outputVal.Value);
            }

            return outputID;
        }
        public DataSet downloadCommand(string query, SqlParameter[] parameters = null)
            {
                
                sqlConnection.Open();
        
                
                SqlCommand cmd = new SqlCommand(query);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = sqlConnection;
                
                if (parameters != null)
                {
                    cmd.Parameters.AddRange(parameters);
                }
        
                
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                DataSet data = new DataSet();
                adapter.Fill(data);
        
                
                sqlConnection.Close();  
                return data;
            }
    }
}