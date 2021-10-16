using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace GalacticCrew.WebServer.Models
{
    public class User
    {
       // [StringLength(50, MinimumLength = 3)]
        [Required]
        public string UserName { get; set; }
       // [StringLength(50, MinimumLength = 5)]
        [Required]
        public string Password { get; set; }

    }
    public class UserIDName
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
    }

    public class UserName
    {
        public string userName { get; set; }
    }
    public class PlayerProfile
    {
        public string NickName;
        int PlayerLevel;
        int Currency;
        int RankID;
    }

    public class PlayerOnLogInInfo
    {
        public string Username { get; set; }
        public string Nickname { get; set; }
        public int PlayerLevel { get; set; }
        public int Currency { get; set; }
        public int RankID { get; set; }
        public string RankType { get; set; }
        public string ShipName { get; set; }
    }

}
