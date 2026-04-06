namespace healthWebApi
{
    public class RegisterUser
    {


        public required string Username { get; set; }
        public required string Password { get; set; }
        public string Role { get; set; } = "User";


    }
}