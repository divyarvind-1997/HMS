using System.ComponentModel.DataAnnotations;

namespace healthWebApi
{
    public class User
    {

        [Key]
        public int Id { get; set; }
        public required string Username { get; set; }
        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }
        public string Role { get; set; } = "User";
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? ExpiryDate { get; set; }

    }
}