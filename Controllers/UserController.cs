using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using UseCaseWeb.Models.DTO;
using UseCaseWeb.Services;

namespace UseCaseWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public UserController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AddUserDTO user)
        {
            var userEntity = _userService.GetByName(user.Name);
            if (userEntity is null || !_userService.VerifyPassword(userEntity, user.Password))
                return Unauthorized("Invalid username or password");

            var token = GenerateJwtToken(userEntity.Name, userEntity.UserId);
            return Ok(new { Token = token, Name = userEntity.Name });
        }

        private string GenerateJwtToken(string username, int UserId)
        {
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, UserId.ToString()),
                new Claim(ClaimTypes.Name, username)
            };

            var secretKey = _configuration["JWT:SecretKey"];
            var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey));
            var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

            var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("Register")]
        public IActionResult AddUser(AddUserDTO user)
        {
            var existing = _userService.GetByName(user.Name);
            if (existing != null)
                return BadRequest("User already exists");

            _userService.Register(user);
            return Ok("User Added Successfully");
        }
    }
}