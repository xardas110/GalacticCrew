using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GalacticCrew.WebServer.Models;
using GalacticCrew.WebServer.Services.MySQL;
using Microsoft.AspNetCore.Authorization;
using GalacticCrew.WebServer.Services.Methods;

namespace GalacticCrew.WebServer.Controllers
{
    [ApiController]
    [Route("Api")]
    public class MyShipsController : Controller
    {

        private readonly SecurityService _securityService;
        private QuerySQL _mysql;

        public MyShipsController(SecurityService securityService, QuerySQL mysql)
        {
            _securityService = securityService;
            _mysql = mysql;
        }

        [HttpGet]
        [Route("UpgradeShip/{shipID}")]
        public IActionResult UpgradeShip(int shipID)
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                int iStatus = _mysql.UpgradeShip(uIDN.UserID, shipID);

               switch(iStatus)
               {
                    case  1: return Ok("Ship Upgraded!");
                    case -2: return BadRequest("Insufficient funds");
                    case -3: return BadRequest("Player does not own the ship");
                    case -4: return BadRequest("Transaction failed");
                    default: return UnprocessableEntity("Database exception error");
               }    
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return UnprocessableEntity("Something went wrong");
            }
        }
    }
}
