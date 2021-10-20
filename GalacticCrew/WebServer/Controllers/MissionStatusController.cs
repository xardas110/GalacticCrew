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
    public class MissionStatusController : Controller
    {

        private readonly SecurityService _securityService;
        private QuerySQL _mysql;

        public MissionStatusController(SecurityService securityService, QuerySQL mysql)
        {
            _securityService = securityService;
            _mysql = mysql;
        }

        [HttpGet]
        [Route("MyShips")]
        public IActionResult GetOwnedShips()
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                List<ShipItem> shipList = new List<ShipItem>();
                int iStatus = _mysql.GetOwnedShipsByUserID(uIDN.UserID, shipList);

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
        [Route("MyShips/{shipID}")]
        public IActionResult GetShipByShipID(int shipID)
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                ShipInformation shipInformation = new ShipInformation();
                int iStatus = _mysql.GetShipByShipID(shipID, shipInformation);


                switch(iStatus)
                {
                    case 1:     return Ok(shipInformation);
                    case 0:     return NoContent();
                    default:    return UnprocessableEntity("Database error!");
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return UnprocessableEntity("Something went wrong");
            }
        }

        [HttpGet]
        [Route("MissionProbability/{missionID}/{shipID}")]
        public IActionResult GetMissionProbability(int missionID, int shipID)
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                MissionProbabilityInformation MPI = new MissionProbabilityInformation();
                int iStatus = _mysql.GetMissionProbabilityInformation(uIDN.UserID, missionID, shipID, MPI);

                switch(iStatus)
                {
                    case 1:
                    {
                        MissionProbabilityResult missionProbabilityResult = new MissionProbabilityResult();
                        missionProbabilityResult.probability = MissionProbabilityCalculator.GetMissionProbability(MPI);

                                return Ok(missionProbabilityResult);
                    }
                    case 0:     return NoContent();
                    default:    return UnprocessableEntity("Something went wrong");

                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return UnprocessableEntity("Database exception error");
            }
        }

        [HttpGet]
        [Route("StartAcceptedMission/{shipID}")]
        public IActionResult StartAcceptedMission(int shipID)
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                int iStatus = _mysql.StartMissionByUserID(uIDN.UserID, shipID);

                switch (iStatus)
                {
                    case  1: return Ok("Mission Started!");
                    case -2: return BadRequest("You don't own that ship");
                    case -3: return BadRequest("Something went wrong");
                    case -4: return BadRequest("You have not accepted that mission!");
                    case -5: return BadRequest("You have already started that mission");
                    case -6: return BadRequest("Something went wrong");
                    default: return UnprocessableEntity("Something went wrong");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return UnprocessableEntity("Something went wrong");
            }
        }

        [HttpGet]
        [Route("CancelMission")]
        public IActionResult CancelOnGoingMission()
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                int iStatus = _mysql.CancelOngoingMission(uIDN.UserID);

                switch (iStatus)
                {
                    case 2: return Ok();
                    case 1: return NoContent();
                    default: return UnprocessableEntity("Database exception error");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return UnprocessableEntity("Something went wrong");
            }
        }

        [HttpGet]
        [Route("CompleteMission")]
        public IActionResult CompleteOnGoingMission()
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");


                UserShipAndMission usam = new UserShipAndMission();
                int iStatus = _mysql.GetUserShipIDAndMissionID(uIDN.UserID, usam);

                if (iStatus != 1)
                {
                    return UnprocessableEntity("Database error");
                }

                MissionProbabilityInformation MPI = new MissionProbabilityInformation();
                iStatus = _mysql.GetMissionProbabilityInformation(uIDN.UserID, usam.missionID, usam.shipID, MPI);

                if (iStatus != 1)
                {
                    return UnprocessableEntity("Database error");
                }

                //in %
                int probabilty = Convert.ToInt32(MissionProbabilityCalculator.GetMissionProbability(MPI));

                Random rd = new Random();
                int randNum = rd.Next(0, 100);
                Console.WriteLine("Player probability: " + probabilty);
                Console.WriteLine("Rand Nr from server" + randNum);

                if (randNum > probabilty)
                {
                    iStatus = _mysql.MissionFailed(uIDN.UserID);
                    if (iStatus != 2)
                        return UnprocessableEntity("Database error");

                    return BadRequest("Mission Failed");
                }

                iStatus = _mysql.CompleteMission(uIDN.UserID);
                Console.WriteLine("I STATUS UNDER");
                Console.WriteLine(iStatus);
                switch (iStatus)
                {
                    case  1: return Ok("Mission Complete!");
                    case -2: return BadRequest("You don't have the mission!");
                    case -3: return BadRequest("Mission not started!");
                    case -4: return BadRequest("Mission not complete!");
                    case -5: return BadRequest("Database error -5");
                    case -6: return BadRequest("Database error -6");
                    case -7: return BadRequest("Database error -7");
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
