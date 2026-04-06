using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using healthWebApi.Data;
using healthWebApi;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using healthWebApi.Services;
using System.Security.Cryptography;

namespace healthWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        private readonly IConfiguration _config;

        public UserController(TokenService tokenService, AppDbContext context)
        {

            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUser request)
        {

            if (await _context.Users.AnyAsync(x => x.Username == request.Username))
                return BadRequest("User already exists.");

            CreatePasswordHash(request.Password, out byte[] hash, out byte[] salt);

            var user = new User
            {
                Username = request.Username,
                PasswordHash = hash,
                PasswordSalt = salt,
                Role = request.Role,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Registered successfully.");


        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUser request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == request.Username);

            if (user == null)
                return Unauthorized("Invalid username or password.");

            if (!VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Invalid username or password.");

            var token = _tokenService.CreateToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.Token = token;
            user.RefreshToken = refreshToken;
            user.ExpiryDate = DateTime.UtcNow.AddMinutes(60);

            await _context.SaveChangesAsync();

            return Ok(new { token, refreshToken, role = user.Role,username=user.Username });
        }

        // Utility functions
        private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using var hmac = new HMACSHA256();
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private bool VerifyPassword(string password, byte[] hash, byte[] salt)
        {
            using var hmac = new HMACSHA256(salt);
            var computed = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computed.SequenceEqual(hash);
        }


    }
}
