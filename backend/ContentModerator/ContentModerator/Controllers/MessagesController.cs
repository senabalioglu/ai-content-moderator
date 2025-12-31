using ContentModerator.Data;
using ContentModerator.Models;
using ContentModerator.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace ContentModerator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly AnalyzeMessageService _analyzeMessageService;

        public MessagesController(AnalyzeMessageService analyzeMessageService)
        {
            _analyzeMessageService = analyzeMessageService;
        }

        public class AnalyzeRequest
        {
            public Guid UserId { get; set; }
            public string Content { get; set; } = null!;
        }

        [HttpPost]
        public async Task<IActionResult> Analyze([FromBody] AnalyzeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
            {
                return BadRequest("Text is required.");
            }

            var message = await _analyzeMessageService.AnalyzeMessageAsync(request.UserId, request.Content);
            return Ok(message);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetForUser(Guid userId)
        {
            var messages = await _analyzeMessageService.GetMessageForUserAsync(userId);
            return Ok(messages);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllMessages()
        {
            var messages = await _analyzeMessageService.GetAllMessagesAsync();
            return Ok(messages);
        }
    }
}
