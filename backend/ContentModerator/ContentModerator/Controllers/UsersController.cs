using ContentModerator.Data;
using ContentModerator.Dtos;
using ContentModerator.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContentModerator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] string username)
        {
            if (string.IsNullOrWhiteSpace(username)) 
            {
                return BadRequest("Username cannot be empty");
            }
            
            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.UserName == username);

            if (existingUser != null) 
            {
                return Ok(existingUser);
            }

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                UserName = username.Trim()
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(newUser);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users.Include(x => x.Messages).Select(x => new UserDto
            {
                Id = x.Id,
                UserName = x.UserName,
                UserMessages = x.Messages.Select(m => new MessageDto
                {
                    Id = m.Id,
                    Content = m.Content,
                    Result = m.Result
                }).ToList()
                
            }).ToListAsync();

            return Ok(users);
        }

    }
}
