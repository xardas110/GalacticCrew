using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GalacticCrew.WebServer.Models
{
    public class ShipItem
    {
        public int ShipID { get; set; }
        public string ShipTitle { get; set; }
    }
    public class ShipInformation
    {
        public int ShipID { get; set; }
        public string ShipType { get; set; }
        public string ShipTitle { get; set; }
        
        public decimal ShipFuelCapacity { get;  set; }
        public int ShipLevel { get; set; }
        public int ShipCost { get; set; }
        public int ShipUpgradeCost { get; set; }
    }
}
