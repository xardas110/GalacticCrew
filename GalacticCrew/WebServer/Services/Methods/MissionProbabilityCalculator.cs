using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GalacticCrew.WebServer.Models;
using GalacticCrew.WebServer.Services.MySQL;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

namespace GalacticCrew.WebServer.Services.Methods
{
    public class MissionProbabilityCalculator
    {
        static public float GetMissionLevel(int missionRank)
        {
            return missionRank + (missionRank * missionRank);
        }

        static public float GetRatioBasedOnType(string shipType, string missionType)
        {
            Dictionary<string, int> Types = new Dictionary<string, int>();
            Types.Add("Fighter", 1);
            Types.Add("Hauler", 2);
            Types.Add("Research Vessel", 3);
            Types.Add("Delivery", 2);
            Types.Add("Mercenary Work", 1);
            Types.Add("Find Treasure", 3);

            int iShipType = 0;
            int iMissionType = 0;

            if (Types.ContainsKey(shipType)) iShipType = Types[shipType];

            if (Types.ContainsKey(missionType)) iMissionType = Types[missionType];

            if (iShipType != iMissionType) return 0.7f;

            return 1.0f;
        }

        static public float CalculateMissionProbability(string shipType, string missionType, int shipLevel, int PlayerLevel, int shipFuel, int missionDistance, int MissionRank)
        {
            float prob1 = (shipFuel / missionDistance) * 0.33f;
            float prob2 = (shipLevel + PlayerLevel) / GetMissionLevel(MissionRank) * 0.34f;

            float prob3 = 0.0f;
            Dictionary<string, int> Types = new Dictionary<string, int>();
            //mission types
            Types.Add("Mercenary Work", 1);
            Types.Add("Trade", 3);
            Types.Add("Find Treasure", 2);
            Types.Add("Expedition", 4);
            Types.Add("Piracy", 1);

            //ship types
            Types.Add("Military", 1);
            Types.Add("Cargo", 3);
            Types.Add("Scout", 2);
            Types.Add("Science", 4);

            int iShipType = 0;
            int iMissionType = 0;

            if (Types.ContainsKey(shipType)) iShipType = Types[shipType];
            if (Types.ContainsKey(missionType)) iMissionType = Types[missionType];
            if (iMissionType == iShipType) prob3 = 1.0f * 0.33f;


            return prob1 + prob2 + prob3;
        }

        /// <summary>
        /// Mission probability for success
        /// </summary>
        /// <param name="MPI"></param>
        /// <returns>Returns probability in %</returns>
        static public float GetMissionProbability(MissionProbabilityInformation MPI)
        {
            float result = CalculateMissionProbability(MPI.ShipType, MPI.MissionType, MPI.ShipLevel, MPI.PlayerLevel, Convert.ToInt32(MPI.ShipFuelCapacity), Convert.ToInt32(MPI.MissionDistance), MPI.MissionRank);
            return result *= 100.0f;
        }

    }
}
