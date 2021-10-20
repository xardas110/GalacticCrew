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

        static public float GetRatioBasedOnFuel(int shipLevel, decimal shipFuelCapacity, decimal missionDistance)
       {
            decimal fuelPrDistance = 20;
            fuelPrDistance += (shipLevel * fuelPrDistance);
            var steps = missionDistance / fuelPrDistance;

            if (steps > 10)
                return 0.5f;

            return 1.0f;
       }
       
        static public float GetRatioBasedOnLevel(int shipLevel, int missionRank)
        {
            var missionLevel = GetMissionLevel(missionRank);
            var delta = missionLevel - shipLevel;

            if (delta < 0)
                return 1.0f;
            else if (delta >= 0 && delta < 3)
                return 0.7f;
            else if (delta >= 3 && delta < 6)
                return 0.3f;
            else
                return 0.05f;
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
        /// <summary>
        /// Mission probability for success
        /// </summary>
        /// <param name="MPI"></param>
        /// <returns>Returns probability in %</returns>
        static public float GetMissionProbability(MissionProbabilityInformation MPI)
        {
            float result = 1.0f;
            result *= MissionProbabilityCalculator.GetRatioBasedOnFuel(MPI.ShipLevel, MPI.ShipFuelCapacity, MPI.MissionDistance);
            result *= MissionProbabilityCalculator.GetRatioBasedOnLevel(MPI.ShipLevel, MPI.MissionRank);
            result *= MissionProbabilityCalculator.GetRatioBasedOnType(MPI.ShipType, MPI.MissionType);
            return result *= 100.0f;
        }

    }
}
