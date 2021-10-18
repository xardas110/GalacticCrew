﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GalacticCrew.WebServer.Models
{
    public class Profile
    {
        public string nickName { get; set; }

        public int playerLevel { get; set; }

        public int currency { get; set; }
    }

    public class PlayerCurrency
    {
        public decimal currency { get; set; }
    }
}
