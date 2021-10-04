using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GalacticCrew.WebServer.Models
{
    public class Missions
    {
        public string MissionTitle { get; set; }
        public string MissionDesc { get; set; }
        public decimal MissionReward { get; set; }
        public decimal MissionDistance { get; set; }
    }
}
