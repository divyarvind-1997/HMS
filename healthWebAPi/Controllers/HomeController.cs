using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace healthWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        [Authorize(Roles = "admin")]
        [HttpGet("admin-data")]
        public IActionResult AdminContent()
        {
            return Ok("This is ADMIN protected data.");
        }

         [Authorize(Roles = "user")]
        [HttpGet("user-data")]
        public IActionResult UserContent()
        {
            return Ok("This is user protected data.");
        }
    }
}