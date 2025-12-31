using System.ComponentModel.DataAnnotations;

namespace ContentModerator.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string UserName { get; set; }

        public ICollection<Message> Messages { get; set; } = new List<Message>();

    }
}
