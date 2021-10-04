using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using GalacticCrew.WebServer.Models;
using GalacticCrew.WebServer.Services.Methods;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GalacticCrew.WebServer.Services.MySQL;

namespace GalacticCrew.WebServer.Controllers
{
    [Route("Api")]
    public class UserController
    {
        QuerySQL _mySQL;
        public UserController(IConfiguration Configuration, QuerySQL mySQL)
        {
            _mySQL = mySQL;
        }

        [HttpPost("PlayerProfile")]
        public Profile Profile(int UserID)
        {
            /* Returns profile model */
            Profile response = new Profile();
            response = _mySQL.GetProfileTable(UserID);

            return response;
        }
    }
}
