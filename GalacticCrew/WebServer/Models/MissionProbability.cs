using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GalacticCrew.WebServer.Models
{ 
    public class MissionProbabilityInformation
    {
        public int PlayerLevel { get; set; }
        public string ShipType { get; set; }
        public decimal ShipFuelCapacity { get; set; }
        public int ShipLevel { get; set; }
        public int MissionRank { get; set; }
        public string MissionType { get; set; }
        public decimal MissionDistance { get; set; }
    }
    public class MissionProbabilityResult
    {
        public float probability { get; set; }
    }
}
