using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GalacticCrew.WebServer.Models;
using GalacticCrew.WebServer.Services.MySQL;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

namespace GalacticCrew.WebServer.Services.Methods
{
    public class SecurityService
    {
        static private readonly string JWTSecretKey = "TempKeykmdsngjknlmdsng";
        static private readonly string JWTIssuer = "MyDomain";
        private QuerySQL _mySQL;

        public SecurityService (QuerySQL querySQL)
        {
            _mySQL = querySQL;
        }

        /// <summary>
        /// Checks if login information 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public int ValidateLogin(User user)
        {
            return _mySQL.AuthenticateLogin(user);
        }

        public bool ValidateRegister(User user)
        {
            if (_mySQL.CheckUserExistsByName(user.UserName) == 1)
                return false;

            return _mySQL.CreateUser(user);
        }

        public Profile GetProfileByID(int userID)
        {
           return _mySQL.GetProfileTable(userID);
        }
        public bool CreatePlayerByNickname(string nickname, int userid)
        {
            return _mySQL.CreatePlayerByNickname(nickname, userid);
        }
        public string GenerateJSONWebToken(User user, int userID)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTSecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //TODO: replace userName with userID
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.NameId, Convert.ToString(userID))
            };

            var token = new JwtSecurityToken(JWTIssuer,
              JWTIssuer,
              claims,
              expires: DateTime.Now.AddMinutes(120),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public JwtSecurityToken Verify(string jwt)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(JWTSecretKey);

            tokenHandler.ValidateToken(jwt, new TokenValidationParameters()
            {
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = false,
                ValidateAudience = false
            }, out SecurityToken validatedToken);

            return (JwtSecurityToken)validatedToken;
        }

        public UserIDName VerifyAndGetClaims(string jwt)
        {
            try
            {
                UserIDName uIDName = new UserIDName();

                var validatedToken = Verify(jwt);

                uIDName.UserName = validatedToken.Claims.Where(x => x.Type == JwtRegisteredClaimNames.Sub).FirstOrDefault().Value;
                uIDName.UserID = Convert.ToInt32(validatedToken.Claims.Where(x => x.Type == JwtRegisteredClaimNames.NameId).FirstOrDefault().Value);

                return uIDName;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return null;
            }
        }
    }
}
