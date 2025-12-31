namespace ContentModerator.Dtos
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public List<MessageDto> UserMessages { get; set; }
    }
}
