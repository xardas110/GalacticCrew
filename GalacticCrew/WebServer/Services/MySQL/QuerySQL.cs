using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GalacticCrew.WebServer.Models;
using MySql.Data.MySqlClient;

namespace GalacticCrew.WebServer.Services.MySQL
{
    
    public class QuerySQL
    {
        static private readonly string ConnectionString = "server=localhost;port=3306;userid=test;database=oblig2;SSL Mode=None";

        /// <summary>
        /// This function will get all data rows based on Missions struct from missions table
        /// </summary>
        /// <returns>
        /// @returns A list of all the missions from missions table.
        /// </returns>
        public List<Missions> GetMissionTable()
        {
            string queryText = "Select MissionTitle, MissionReward, Distance, MissionDesc from missions";
            List<Missions> missions = new List<Missions>();

            using (var connection = new MySqlConnection(ConnectionString))
            {

                MySqlCommand cmd = new MySqlCommand(queryText, connection);

                try
                {
                    connection.Open();              
                    MySqlDataReader data = cmd.ExecuteReader();
                    Console.WriteLine("try branch running");
                    while (data.Read())
                    {
                        Missions mission = new Missions();
                        mission.MissionTitle = data[0].ToString();
                        mission.MissionDesc = data[3].ToString();
                        mission.MissionReward = (decimal)data[1];
                        mission.MissionDistance = (decimal)data[2];
                        missions.Add(mission);
                        Console.WriteLine(mission.MissionTitle);
                    }
                   
                }
                catch(Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
                connection.Close();
            }
            
            return missions;
        }

        /// <summary>
        /// This function will authenticate a user by username and password in users table
        /// </summary>
        /// @param User object.
        /// <returns>
        /// @returns true if user credentials match otherwise false.
        /// </returns>
        public bool AuthenticateLogin(User user)
        {
            string query = "select username, password from users where username = @UserName";
            bool bSuccess = false;
            using (var connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                
                cmd.Parameters.Add("@Username", MySqlDbType.VarChar, 20).Value = user.UserName;

                try
                {
                    connection.Open();
                    MySqlDataReader data = cmd.ExecuteReader();

                    //Usernames inside mysql are set to unique, this should be safe 
                    while (data.Read())
                    {
                        bSuccess = BCrypt.Net.BCrypt.Verify(user.Password, data[1].ToString());
                        break;
                    }
                }
                catch(Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
                connection.Close();
            }
            return bSuccess;
        }

        /// <summary>
        /// This function will check if a user exists in users table
        /// </summary>
        /// @param Username.
        /// <returns>
        /// @returns 1 if user exists, -1 if query failed, 0 if user does not exist.
        /// </returns>
        public int CheckUserExistsByName(string userName)
        {      
            var query = "select Username from users where Username = @UserName";
            int bSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@Username", MySqlDbType.VarChar, 20).Value = userName;
                
                try
                {
                    connection.Open();
                    MySqlDataReader data = cmd.ExecuteReader();

                    // This block will only run if there are no exception errors.
                    if (data.HasRows)
                        bSuccess = 1;
                    else
                        bSuccess = 0;                          
                }
                catch(Exception e)
                {
                    Console.WriteLine(e.ToString());
                }

            }
            return bSuccess;
        }

        //TODO: Encrypt password
        /// <summary>
        /// This function will create a user in MySQL users table. No validation is done inside this function, once called the user will be created if MySQL validation passes
        /// </summary>
        /// @param User struct.
        /// <returns>
        /// @returns 1 if the user is created otherwise user creation failes and it will return 0.
        /// </returns>
        public bool CreateUser(User user)
        {
            var query = "insert into users (Username, Password) VALUES(@Username, @Password)";
            bool bSuccess = false;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@Username", MySqlDbType.VarChar, 20).Value = user.UserName;
                cmd.Parameters.Add("@Password", MySqlDbType.VarChar, 200).Value = BCrypt.Net.BCrypt.HashPassword(user.Password);

                try
                {
                    connection.Open();

                    if (cmd.ExecuteNonQuery() != -1)
                        bSuccess = true;
                    else
                        bSuccess = false;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }
            return bSuccess;
        }
    }
}
