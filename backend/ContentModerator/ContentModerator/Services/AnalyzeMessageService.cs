using ContentModerator.Data;
using ContentModerator.Dtos;
using ContentModerator.Models;
using Microsoft.AspNetCore.Mvc;
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
            if (!await _context.Users.AnyAsync(u => u.Id == userId))
                throw new ArgumentException($"User {userId} not found");

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

            var root = doc.RootElement;

            if (!root.TryGetProperty("data", out var data) || data.GetArrayLength() == 0)
                throw new Exception("Model response does not contain data");

            var results = data[0].GetProperty("results");

            bool GetScore(string key, string riskyLabel, float threshold)
            {
                if (!results.TryGetProperty(key, out var section))
                    return false;

                var label = section.GetProperty("label").GetString();
                var score = section.GetProperty("score").GetSingle();

                return label == riskyLabel && score > threshold;
            }

            bool isBlocked =
                GetScore("toxicity", "toxic", 0.8f) ||
                GetScore("spam", "LABEL_1", 0.7f) ||
                GetScore("nsfw", "NSFW", 0.6f) ||
                GetScore("hate_speech", "HATE", 0.7f);

            var message = new Message
            {
                Content = text,
                Result = results.GetRawText(),
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
                Created = m.Created,
                UserId = m.UserId,
                UserName = m.User.UserName,
                IsBlocked = m.IsBlocked,
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
                UserName = m.User.UserName,
                IsBlocked = m.IsBlocked,
            }).ToListAsync();
        }

        public async Task<Message> DeleteByContent(string content)
        {
            var messageToDelete = await _context.Messages.FirstOrDefaultAsync(m => m.Content == content);
            if (messageToDelete == null)
            {
                throw new Exception("Message not found");
            }
            _context.Messages.Remove(messageToDelete);
            await _context.SaveChangesAsync();
            return messageToDelete;
        }
    }
}
