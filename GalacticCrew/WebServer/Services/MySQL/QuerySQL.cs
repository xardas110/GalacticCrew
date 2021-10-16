using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using GalacticCrew.WebServer.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace GalacticCrew.WebServer.Services.MySQL
{
    public class QuerySQL
    {
        static private readonly string ConnectionString = "server=87.248.13.40;port=3306;userid=test;database=oblig2;SSL Mode=None;CharSet=utf8";

        /// <summary>
        /// Available missions (Missions that aren't inside the ongoing mission table)
        /// </summary>
        /// <param>List of missions in-out</param>
        /// <returns>number of rows if success, 0 if no rows, -1 if exception error</returns>
        public int GetAvailableMissions(List<Mission> missionList)
        {
            int iSuccess = -1;
            string queryText = "call sp_GetAvailableMissions()";

            using (var connection = new MySqlConnection(ConnectionString))
            {

                MySqlCommand cmd = new MySqlCommand(queryText, connection);

                try
                {
                    connection.Open();              
                    MySqlDataReader data = cmd.ExecuteReader();


                    iSuccess = 0;
                    while (data.Read())
                    {
                        Mission mission = new Mission();
                        mission.MissionID = (int)data[0];
                        mission.MissionTitle = data[1].ToString();
                        mission.MissionType = data[2].ToString();
                        mission.MissionReward = (decimal)data[3];
                        missionList.Add(mission);
                        iSuccess += 1;
                    }                 
                }
                catch(Exception e)
                {
                    iSuccess = -1;
                    Console.WriteLine(e.ToString());
                }
                connection.Close();
            }
            return iSuccess;
        }

        public bool CreatePlayerByNickname(string nickname, int userid)
        {
            string queryText = "call sp_CreateNickname(@userID, @nickname)";
            bool bSuccess = false;

            using (var connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(queryText, connection);
                
                cmd.Parameters.Add("@userID", MySqlDbType.Int32, 11).Value = userid;
                cmd.Parameters.Add("@nickname", MySqlDbType.VarChar, 20).Value = nickname;

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
                    return bSuccess;
                }
                connection.Close();
            }
            return bSuccess;
        }
        
        public PlayerOnLogInInfo GetPlayerOnLogInInfo(int uID)
        {    
            using (var connection = new MySqlConnection(ConnectionString))
            {               
                try
                {
                    string queryText = "call sp_OnLoginInformation(@userID)";
                    MySqlCommand cmd = new MySqlCommand(queryText, connection);

                    cmd.Parameters.Add("@userID", MySqlDbType.Int32, 11).Value = uID;
                    connection.Open();
                    MySqlDataReader data = cmd.ExecuteReader();

                    while (data.Read())
                    {
                        PlayerOnLogInInfo profile = new PlayerOnLogInInfo();
                        profile.Username = data[0].ToString();
                        profile.Nickname = data[1].ToString();
                        profile.RankType = data[2].ToString();
                        profile.PlayerLevel = (int)data[3];
                        profile.Currency = (int)data[4];
                        profile.RankID = (int)data[5];
                       
                        profile.ShipName = data[6].ToString();

                        connection.Close();

                        return profile;
                    }

                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
                connection.Close();
            }
            return null;
        }

        public Profile GetProfileTable(int userID)
        {
            string queryText = "call sp_GetProfileByUserID(@userID)";
            Profile profile = new Profile();

            using (var connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(queryText, connection);

                cmd.Parameters.Add("@userID", MySqlDbType.Int32, 11).Value = userID;

                try
                {
                    connection.Open();
                    MySqlDataReader data = cmd.ExecuteReader();

                    while (data.Read())
                    {
                        profile.nickName = data[0].ToString();
                        profile.playerLevel = (int)data[1];
                        profile.currency = (int)data[2];
                    }

                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    return null;
                }
                connection.Close();
            }
            return profile;
        }

        /// <summary>
        /// This function will authenticate a user by username and password in users table
        /// </summary>
        /// @param User object.
        /// <returns>
        /// @returns true if user credentials match otherwise false.
        /// </returns>
        public int AuthenticateLogin(User user)
        {
            string query = "select username, password, UserID from users where username = @UserName";
            int iSuccess = -1;
            using (var connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                
                cmd.Parameters.Add("@Username", MySqlDbType.VarChar, 20).Value = user.UserName;

                try
                {
                    connection.Open();
                    MySqlDataReader data = cmd.ExecuteReader();

                    //Usernames inside mysql are set to unique, no checks needed here
                    while (data.Read())
                    {
                        if (BCrypt.Net.BCrypt.Verify(user.Password, data[1].ToString()))
                            iSuccess = (int)data[2];
                        break;
                    }
                }
                catch(Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
                connection.Close();
            }
            return iSuccess;
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

        /// <summary>
        /// Get a mission by mission id, used in the mission panel tab (more information button)
        /// </summary>
        /// <param>Mission ID</param>
        /// <returns>1 if success, 0 if no row found, -1 if exception error</returns>
        public int GetMissionByMissionID(int missionID, MissionInformation missionInformation)
        {
            var query = "call sp_GetMissionByMissionID(@MissionID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@MissionID", MySqlDbType.Int32, 11).Value = missionID;

                try
                {
                    connection.Open();
                    MySqlDataReader data = cmd.ExecuteReader();

                    iSuccess = 0;
                    while (data.Read())
                    {
                        missionInformation.MissionID = (int)data[0];
                        missionInformation.MissionRank = (int)data[1];
                        missionInformation.MissionType = data[2].ToString();
                        missionInformation.MissionTitle = data[3].ToString();
                        missionInformation.MissionReward = (decimal)data[4];
                        missionInformation.MissionDistance = (decimal)data[5];
                        missionInformation.MissionDesc = (string)data[6];
                        missionInformation.MissionTime = (decimal)data[7];
                        iSuccess += 1;
                    }

                    if (iSuccess > 1) throw new Exception("Returns more than one mission by missionID");
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }

            }
            return iSuccess;
        }

        /// <summary>
        ///  Accepts a mission by userID and missionID
        /// </summary>
        /// <param name="userID">UserID taken by JWT token </param>
        /// <param name="missionID">MissionID recieved from http get</param>
        /// <returns>2 if success, 1 if user already have a ongoing mission, -1 if fails</returns>
        /// TODO: Currently it will either return 2 or -1. This library give different results from mysql workbench
        public int AcceptMissionByMissionID(int userID, int missionID)
        {
            var query = "call sp_AcceptMissionByUserID(@UserID, @MissionID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@UserID", MySqlDbType.Int32, 11).Value = userID;
                cmd.Parameters.Add("@MissionID", MySqlDbType.Int32, 11).Value = missionID;

                try
                {
                    connection.Open();                  
                    return cmd.ExecuteNonQuery();

                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }

        /// <summary>
        /// Gets a mission if player has one
        /// </summary>
        /// <param name="userID">User ID recieved from the token</param>
        /// <returns>1 if player has a mission, 0 if player has no mission, -1 if exception error</returns>
        public int GetOngoingMissionByUserID(int userID, MissionOnGoing missionOnGoing)
        {
            var query = "call sp_GetOnGoingMissionByUserID(@UserID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@UserID", MySqlDbType.Int32, 11).Value = userID;

                try
                {
                    connection.Open();
                    iSuccess = 0;
                    MySqlDataReader data = cmd.ExecuteReader();

                    while (data.Read())
                    {                       
                        missionOnGoing.MissionID = (int)data[0];
                        missionOnGoing.MissionTitle = data[1].ToString();
                        missionOnGoing.MissionRank = (int)data[2];
                        missionOnGoing.MissionType = data[3].ToString();
                        missionOnGoing.MissionDistance = (decimal)data[4];
                        missionOnGoing.MissionDuration = (decimal)data[5];
                        missionOnGoing.MissionAcceptedDate = System.DBNull.Value.Equals(data[6]) ? DateTime.MinValue : (DateTime)data[6];                      
                        missionOnGoing.MissionStartedDate = System.DBNull.Value.Equals(data[7])? DateTime.MinValue: (DateTime)data[7];
                        missionOnGoing.bMissionStarted = !System.DBNull.Value.Equals(data[7]);
                        iSuccess += 1;
                    }

                    if (iSuccess > 1)
                    {
                        iSuccess = -1;
                        throw new Exception("More than one ongoing mission recieved, something is wrong");
                    }

                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }
        /// <summary>
        /// Get all owned ships by a player
        /// </summary>
        /// <param name="userID">User ID from token</param>
        /// <param name="shipList">List to be filled if function succeeds</param>
        /// <returns>Nr. rows if success, 0 if no ships, -1 if exception error</returns>
        public int GetOwnedShipsByUserID(int userID, List<ShipItem> shipList)
        {
            var query = "call sp_GetOwnedShipListByUserID(@UserID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@UserID", MySqlDbType.Int32, 11).Value = userID;

                try
                {
                    connection.Open();                  
                    MySqlDataReader data = cmd.ExecuteReader();

                    iSuccess = 0;
                    while (data.Read())
                    {
                        ShipItem shipItem = new ShipItem();
                        shipItem.ShipID = (int)data[0];
                        shipItem.ShipTitle = data[1].ToString();
                        shipList.Add(shipItem);
                        iSuccess += 1;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }
 
        /// <summary>
        /// Get all shipinformation by ship id
        /// </summary>
        /// <param name="shipID">Any ShipID</param>
        /// <param name="shipInformation">Will populate shipinformation param if no error occurs</param>
        /// <returns>1 if success, 0 if ship not found, -1 if exception error</returns>
        public int GetShipByShipID(int shipID, ShipInformation shipInformation)
        {
            var query = "call sp_GetShipByShipID(@ShipID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@ShipID", MySqlDbType.Int32, 11).Value = shipID;

                try
                {
                    connection.Open();
                    MySqlDataReader data = cmd.ExecuteReader();

                    iSuccess = 0;
                    while (data.Read())
                    {
                        shipInformation.ShipID = (int)data[0];
                        shipInformation.ShipType = data[1].ToString();
                        shipInformation.ShipTitle = data[2].ToString();
                        shipInformation.ShipFuelCapacity = (decimal)data[3];
                        shipInformation.ShipLevel = (int)data[4];
                        shipInformation.ShipCost = (int)data[5];
                        shipInformation.ShipUpgradeCost = System.DBNull.Value.Equals(data[6])?0: (int)data[6];
                        iSuccess += 1;
                    }

                    if (iSuccess > 1)
                    {
                        iSuccess = -1;
                        throw new Exception("More than one ship returned");
                    }

                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }

        /// <summary>
        /// This function will get all the data needed for mission probability calculation
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="missionID"></param>
        /// <param name="shipID"></param>
        /// <param name="missionProbabilityInformation"></param>
        /// <returns>1 if success, 0 if no content, -1 if exception error</returns>
        public int GetMissionProbabilityInformation(int userID, int missionID, int shipID, MissionProbabilityInformation missionProbabilityInformation)
        {
            var query = "call sp_GetMissionProbabilityInformation(@UserID, @MissionID, @ShipID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@UserID", MySqlDbType.Int32, 11).Value = userID;
                cmd.Parameters.Add("@MissionID", MySqlDbType.Int32, 11).Value = missionID;
                cmd.Parameters.Add("@ShipID", MySqlDbType.Int32, 11).Value = shipID;

                try
                {
                    connection.Open();
                    MySqlDataReader data = cmd.ExecuteReader();

                    iSuccess = 0;
                    while (data.Read())
                    {
                        missionProbabilityInformation.PlayerLevel = (int)data[0];
                        missionProbabilityInformation.ShipType = data[1].ToString();
                        missionProbabilityInformation.ShipFuelCapacity = (decimal)data[2];
                        missionProbabilityInformation.ShipLevel = (int)data[3];
                        missionProbabilityInformation.MissionRank = (int)data[4];
                        missionProbabilityInformation.MissionType = data[5].ToString();
                        missionProbabilityInformation.MissionDistance = (decimal)data[6];
                        iSuccess += 1;
                    }

                    if (iSuccess > 1)
                    {
                        iSuccess = -1;
                        throw new Exception("More than one row returned");
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }

        /// <summary>
        /// Cancels a accepted mission
        /// </summary>
        /// <param name="userID"></param>
        /// <returns>2 if success, 1 if no mission to cancel, -1 if exception error</returns>
        public int CancelOngoingMission(int userID)
        {
            var query = "call sp_CancelOnGoingMission(@UserID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@UserID", MySqlDbType.Int32, 11).Value = userID;

                try
                {
                    connection.Open();
                    iSuccess = cmd.ExecuteNonQuery();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }

        /// <summary>
        /// Starts the mission that the player accepted
        /// </summary>
        /// <param name="userID">From token</param>
        /// <param name="shipID">From client database have safety</param>
        /// <returns>5 if success, 4 if no accepted mission or mission already started, 3 if player tries to cheat, -1 exception error</returns>
        public int StartMissionByUserID(int userID, int shipID)
        {
            var query = "call sp_StartMissionByUserID(@UserID, @ShipID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@UserID", MySqlDbType.Int32, 11).Value = userID;
                cmd.Parameters.Add("@ShipID", MySqlDbType.Int32, 11).Value = shipID;

                try
                {
                    connection.Open();
                    iSuccess = cmd.ExecuteNonQuery();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }
        /// <summary>
        /// Completes a missions
        /// </summary>
        /// <param name="userID"></param>
        /// <returns>1 if success, -1 if fails</returns>
        public int CompleteMission(int userID)
        {
            var query = "call sp_CompleteMission(@UserID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@UserID", MySqlDbType.Int32, 11).Value = userID;

                try
                {
                    connection.Open();
                    MySqlDataReader data = cmd.ExecuteReader();
                    while (data.Read())
                    {
                        iSuccess = (int)Convert.ToInt64(data[0]);
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }

        /// <summary>
        /// Market
        /// </summary>
        /// <param name="userID"></param>
        /// <returns>nr. rows if success, 0 if player owns all ships, -1 if exception error</returns>
        public int GetMarket(int userID, List<ShipInformation> shipList)
        {
            var query = "call sp_GetShipsOnMarket(@UserID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@UserID", MySqlDbType.Int32, 11).Value = userID;

                try
                {
                    connection.Open();
                    MySqlDataReader data = cmd.ExecuteReader();
                    iSuccess = 0;
                    while (data.Read())
                    {
                        ShipInformation shipInformation = new ShipInformation();
                        shipInformation.ShipID = (int)data[0];
                        shipInformation.ShipType = data[1].ToString();
                        shipInformation.ShipTitle = data[2].ToString();
                        shipInformation.ShipFuelCapacity = (decimal)data[3];
                        shipInformation.ShipLevel = (int)data[4];
                        shipInformation.ShipCost = (int)data[5];
                        shipInformation.ShipUpgradeCost = System.DBNull.Value.Equals(data[6]) ? 0 : (int)data[6];
                        shipList.Add(shipInformation);
                        iSuccess += 1;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="shipID"></param>
        /// <returns>2 if success, 1 if player has ship or no funds, -1 exception error</returns>
        public int BuyShip(int userID, int shipID)
        {
            var query = "call sp_BuyShipByShipID(@UserID, @ShipID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@UserID", MySqlDbType.Int32, 11).Value = userID;
                cmd.Parameters.Add("@ShipID", MySqlDbType.Int32, 11).Value = shipID;

                try
                {
                    connection.Open();
                    iSuccess = cmd.ExecuteNonQuery();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }

        /// <summary>
        /// Upgrades a player ship if player owns the ship and has enough money
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="shipID"></param>
        /// <returns>1 if success, -1 if exception error, -2 if player lack funds, -3 if player doesnt own the ship, -4 if transaction failed</returns>
        public int UpgradeShip(int userID, int shipID)
        {
            var query = "Select UpgradeShip(@UserID, @ShipID)";
            int iSuccess = -1;

            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.Parameters.Add("@UserID", MySqlDbType.Int32, 11).Value = userID;
                cmd.Parameters.Add("@ShipID", MySqlDbType.Int32, 11).Value = shipID;

                try
                {
                    connection.Open();
                    iSuccess = (int)cmd.ExecuteScalar();
                }

                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                    iSuccess = -1;
                }
                connection.Close();
            }
            return iSuccess;
        }

    }  
}

