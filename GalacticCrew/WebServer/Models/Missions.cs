using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GalacticCrew.WebServer.Models
{
    public class Mission
    {
        public int MissionID { get; set; }
        public string MissionTitle { get; set; }
        public string MissionType { get; set; }
        public decimal MissionReward { get; set; }
        public decimal MissionDistance { get; set; }
    }

    public class MissionOnGoing
    {
        public int MissionID { get; set; }
        public string MissionTitle { get; set; }
        public int MissionRank { get; set; }
        public string MissionType { get; set; }
        public decimal MissionDistance { get; set; }
        public DateTime MissionAcceptedDate { get; set; }
        public bool bMissionStarted { get; set; }
        public DateTime MissionStartedDate { get; set; }
        public decimal MissionDuration { get; set; }
    }


    public class MissionInformation
    {
        public int MissionID { get; set; }
        public int MissionRank { get; set; }
        public string MissionType { get; set; }
        public string MissionTitle { get; set; }
        public decimal MissionReward { get; set; }
        public decimal MissionDistance { get; set; }
        public string MissionDesc { get; set; }
        public decimal MissionTime { get; set; }
    }

}
