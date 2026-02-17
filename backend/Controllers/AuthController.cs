using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Repository.Interfaces;
using WorkOderManagementSystem.Auth;

namespace WorkOderManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly JwtService _jwtService;

        public AuthController(IUserRepository userRepo, JwtService jwtService)
        {
            _userRepo = userRepo;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var user = await _userRepo.AuthenticateAsync(loginDto.UserName, loginDto.Password);
                if (user == null)
                    return Unauthorized(new { message = "Invalid username or password" });

                var token = _jwtService.GenerateToken(user);

                return Ok(new
                {
                    token,
                    user = new
                    {
                        user.UserId,
                        user.UserFullName,
                        user.UserName,
                        user.DivisionId,
                        user.Division.DivisionCode,
                        user.UserTypeId,
                        user.VendorId
                    }
                });
            }
            catch (Exception ex)
            {
                // 📝 LOG FULL ERROR TO CONSOLE
                Console.WriteLine("========================================");
                Console.WriteLine($"🚨 LOGIN ERROR: {ex.Message}");
                Console.WriteLine($"🔍 STACK TRACE: {ex.StackTrace}");
                if (ex.InnerException != null) 
                    Console.WriteLine($"📦 INNER EXCEPTION: {ex.InnerException.Message}");
                Console.WriteLine("========================================");
                
                return StatusCode(500, new { 
                    message = "Database connection failed or internal server error", 
                    details = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }
        
    }
}
