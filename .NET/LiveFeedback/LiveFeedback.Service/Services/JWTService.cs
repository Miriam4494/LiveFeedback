using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LiveFeedback.Core.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // מזהה המשתמש
            new Claim(JwtRegisteredClaimNames.Email, user.Email), // אימייל
            new Claim(ClaimTypes.Role, user.RoleId == 2 ? "Admin" : "User"), // תפקיד המשתמש
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // מזהה ייחודי לטוקן
            new Claim("UserName", user.UserName),
            new Claim("Points", user.Points.ToString()),
            new Claim("SendQuestion", user.SendQuestion.HasValue ? user.SendQuestion.Value.ToString() : "false"),
            new Claim("SendFeedback", user.SendFeedback.HasValue ? user.SendFeedback.Value.ToString() : "false"),
            new Claim("RoleId", user.RoleId.ToString()),

        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

