using GalacticCrew.WebServer.Models;
using GalacticCrew.WebServer.Services.Methods;
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

        public AuthenticateController(IConfiguration Configuration, SecurityService securityService)
        {
            _config = Configuration;
            _securityService = securityService;
        }

        [HttpPost("Login")]
        public IActionResult Login(User user)
        {
            IActionResult response = Unauthorized();

            if (_securityService.ValidateLogin(user))
            {
                var tokenString = _securityService.GenerateJSONWebToken(user);
                response = Ok(new { token = tokenString });

                Response.Cookies.Append("GalacticCrew", tokenString, new CookieOptions
                {
                    HttpOnly = true,
                });
            }
            
            return response;
        }

        [HttpPost("Register")]
        public bool Register(User user)
        {
            return _securityService.ValidateRegister(user);
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
                Console.WriteLine("Username from userget: " + userName);
                return Ok(new {userName = userName });
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

            return Ok("success");
        }

    }
}
