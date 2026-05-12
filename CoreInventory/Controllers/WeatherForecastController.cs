using Microsoft.AspNetCore.Mvc;

namespace CoreInventory.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StatusController : ControllerBase
    {
        [HttpGet"Ping")]
        public IActionResult Ping ()
        {
            return Ok ("Pong");
        }
    }
}
