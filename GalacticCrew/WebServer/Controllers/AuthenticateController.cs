using GalacticCrew.WebServer.Models;
using GalacticCrew.WebServer.Services.Methods;
using GalacticCrew.WebServer.Services.MySQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace GalacticCrew.WebServer.Controllers
{
    [ApiController]
    [Route("Api")]
    public class AuthenticateController : Controller
    {
        public IConfiguration _config { get; }
        private readonly SecurityService _securityService;
        private QuerySQL _mysql;

        public AuthenticateController(IConfiguration Configuration, SecurityService securityService, QuerySQL mysql)
        {
            _config = Configuration;
            _securityService = securityService;
            _mysql = mysql;
        }

        [HttpPost("Login")]
        public IActionResult Login(User user)
        {
            IActionResult response = Unauthorized();
            int userID = _securityService.ValidateLogin(user);
            if (userID != -1)
            {
                var tokenString = _securityService.GenerateJSONWebToken(user, userID);
                response = Ok(new { userName = user.UserName });

                Response.Cookies.Append("GalacticCrew", tokenString, new CookieOptions
                {
                    HttpOnly = true,
                });
            }
            
            return response;
        }

        [HttpPost("Register")]
        public IActionResult Register(User user)
        {
            if (_securityService.ValidateRegister(user))
                return Ok();
            return BadRequest();
        }

        [HttpPost("CreatePlayer")]
        public IActionResult CreateUser(UserName userName)
        {
            try
            {
                Console.WriteLine("trying to create a new user: " + userName.userName);
                UserIDName uIDN = new UserIDName();
                var tokenString = Request.Cookies["GalacticCrew"];
                uIDN =_securityService.VerifyAndGetClaims(tokenString);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                if (_securityService.CreatePlayerByNickname(userName.userName, uIDN.UserID))
                    return Ok();
                return NotFound();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
                return BadRequest(e.ToString());
            }
        }

        [HttpGet("OnLogin")]
        public IActionResult OnLogin()
        {
            try
            { 
                string token = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(token);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                PlayerOnLogInInfo profile = _mysql.GetPlayerOnLogInInfo(uIDN.UserID);

                if (profile == null)
                    return NotFound("Profile is not found by uID");

                return Ok(profile);
            }
            catch(Exception e)
            {                
                Console.WriteLine(e.ToString());
                return UnprocessableEntity(e.ToString());
            }
        }

        [HttpGet("Profile")]
        public IActionResult Profile()
        {
            try
            {
                Console.WriteLine("Profile api running");
                var tokenString = Request.Cookies["GalacticCrew"];
                UserIDName uIDN = _securityService.VerifyAndGetClaims(tokenString);

                if (uIDN == null)
                    return BadRequest();

                Profile profile = new Profile();
                profile = _securityService.GetProfileByID(uIDN.UserID);

                if (profile == null)
                    return NotFound();

                return Ok(_securityService.GetProfileByID(uIDN.UserID));

            }
            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
                return BadRequest(e.ToString());
            }
        }

        [HttpGet("User")]
        public IActionResult UserInfo()
        {          
            try
            {
                var jwtString = Request.Cookies["GalacticCrew"];
                Console.WriteLine("JWT string: " + jwtString);
                var validatedToken = _securityService.Verify(jwtString);

                var userName = validatedToken.Claims.Where(x => x.Type == JwtRegisteredClaimNames.Sub).FirstOrDefault().Value;
                int userID = Convert.ToInt32(validatedToken.Claims.Where(x => x.Type == JwtRegisteredClaimNames.NameId).FirstOrDefault().Value);

                Console.WriteLine("Username from userget: " + userName + " userID: " + userID);
                return Ok(new {userName = userName, userID = userID});
            }
            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
                return BadRequest(e.ToString());
            }           
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("GalacticCrew");

            return Redirect("/profile");
        }

        [HttpPost("ChangeNickname")]
        public IActionResult ChangeNickname(Nickname nick)
        {
            try
            {
                UserIDName uIDN = new UserIDName();
                var tokenString = Request.Cookies["GalacticCrew"];
                uIDN = _securityService.VerifyAndGetClaims(tokenString);

                if (uIDN == null)
                    return Forbid("Token/TokenClaim is invalid");

                int iStatus = _mysql.ChangeNickname(uIDN.UserID, nick.nickName);
                Console.WriteLine("ISTATUS RETURNED FROM MYSQL:  " + iStatus);

                switch (iStatus)
                {
                    case  1:     return Ok("Nickname changed");
                    case -2:     return BadRequest("Nickname exists!");
                    case -3:     return BadRequest("Database error");
                    default:     return UnprocessableEntity("Something went wrong");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return BadRequest(e.ToString());
            }
        }

    }
}
