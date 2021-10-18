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
    public class MissionsController : Controller
    {

        private readonly SecurityService _securityService;
        private QuerySQL _mysql;

        public MissionsController(SecurityService securityService, QuerySQL mysql)
        {
            _securityService = securityService;
            _mysql = mysql;
        }

        [Route("AvailableMissions")]
        [HttpGet]
        public IActionResult GetAvailableMissions()
        {
            List<Mission> missionList = new List<Mission>();
            int iStatus = _mysql.GetAvailableMissions(missionList);

            if (iStatus > 0)
                return Ok(missionList);
            else if (iStatus == 0)
                return NotFound("No missions found");
          
            return UnprocessableEntity("Database exception error");
        }

        [Route("MissionInformation/{missionID}")]
        [HttpGet]
        public IActionResult GetMissionInformation(int missionID)
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                MissionInformation missionInformation = new MissionInformation();
                int iStatus = _mysql.GetMissionByMissionID(missionID, missionInformation);

                Console.WriteLine("Running mission information");
                Console.WriteLine(missionID);
                Console.WriteLine(missionInformation);
                if (iStatus == 1)
                    return Ok(missionInformation);
                else if (iStatus == 0)
                    return NotFound("Mission not found by Mission ID");

                return UnprocessableEntity("Database exception error");
            }
            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
                return UnprocessableEntity("Something went wrong");
            }          
        }


        [Route("AcceptMission/{missionID}")]
        [HttpGet]
        public IActionResult AcceptMission(int missionID)
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                int iStatus = _mysql.AcceptMissionByMissionID(uIDN.UserID, missionID);
                Console.WriteLine("Status from sql query: %i" + iStatus);

                switch(iStatus)
                {
                    case 2: return Ok("Mission Accepted");
                    default: return UnprocessableEntity("Database exception error");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return UnprocessableEntity("Something went wrong");
            }
        }

        [Route("MissionOngoing")]
        [HttpGet]
        public IActionResult MissionOngoing()
        {
            try
            {
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                MissionOnGoing missionOnGoing = new MissionOnGoing();
                int iStatus = _mysql.GetOngoingMissionByUserID(uIDN.UserID, missionOnGoing);

                if (iStatus == 1)
                    return Ok(missionOnGoing);
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

    }
}
