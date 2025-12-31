namespace ContentModerator.Dtos
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public string Result { get; set; }
        public DateTime Created { get; set; }

        public Guid UserId { get; set; }

        public string? UserName { get; set; }
    }
}
