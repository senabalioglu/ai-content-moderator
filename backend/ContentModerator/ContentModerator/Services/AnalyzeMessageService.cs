using ContentModerator.Data;
using ContentModerator.Dtos;
using ContentModerator.Models;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace ContentModerator.Services
{
    public class AnalyzeMessageService
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;

        public AnalyzeMessageService(AppDbContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
        }

        public async Task<Message> AnalyzeMessageAsync(Guid userId, string text)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                throw new ArgumentException($"User {userId} not found");
            }

            var payload = new { data = new[] { text } };
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(
            "https://sihirlipaspas-toxicity-analyzer.hf.space/api/predict/",
            content
            );

            response.EnsureSuccessStatusCode();
            var resultJson = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(resultJson);
            var results = doc.RootElement.GetProperty("results");

            float GetScore(string key) =>
            results.GetProperty(key).GetProperty("score").GetSingle();

            bool isBlocked =
            GetScore("toxicity") > 0.8 ||
            GetScore("spam") > 0.7 ||
            GetScore("nsfw") > 0.6 ||
            GetScore("hate_speech") > 0.7;

            var resultsJson = doc.RootElement
            .GetProperty("results")
            .GetRawText();

            var message = new Message
            {
                Content = text,
                Result = resultsJson,
                UserId = userId,
                IsBlocked = isBlocked
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task<List<MessageDto>> GetMessageForUserAsync(Guid userId)
        {
            return await _context.Messages.Where(m => m.UserId == userId).Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                Result = m.Result,
                Created = m.Created
            }).ToListAsync();
        }

        public async Task<IEnumerable<MessageDto>> GetAllMessagesAsync()
        {
            return await _context.Messages.Include(m => m.User).Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                Result = m.Result,
                Created = m.Created,
                UserId = m.UserId,
                UserName = m.User.UserName
            }).ToListAsync();
        }
    }
}
