﻿using Microsoft.AspNetCore.Http;
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
    public class MarketController : Controller
    {

        private readonly SecurityService _securityService;
        private QuerySQL _mysql;

        public MarketController(SecurityService securityService, QuerySQL mysql)
        {
            _securityService = securityService;
            _mysql = mysql;
        }

        [HttpGet]
        [Route("Market")]
        public IActionResult GetMarket()
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                List<ShipInformation> shipList = new List<ShipInformation>();
                int iStatus = _mysql.GetMarket(uIDN.UserID, shipList);

                if (iStatus > 0)
                    return Ok(shipList);
                else if (iStatus == 0)
                    return NoContent();

                return UnprocessableEntity("Database exception error");
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return UnprocessableEntity("Something went wrong");
            }
        }

        [HttpGet]
        [Route("Market/buy/{shipID}")]
        public IActionResult BuyShip(int shipID)
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                int iStatus = _mysql.BuyShip(uIDN.UserID, shipID);

                switch(iStatus)
                {
                    case 1: return Ok("Success!");
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