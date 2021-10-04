﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace GalacticCrew.WebServer.Models
{
    public class User
    {
        [StringLength(50, MinimumLength = 3)]
        [Required]
        public string UserName { get; set; }
        [StringLength(50, MinimumLength = 5)]
        [Required]
        public string Password { get; set; }
    }
}