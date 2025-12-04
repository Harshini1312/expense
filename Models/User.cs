namespace UseCaseWeb.Models
{
    public class User
    {
        public int UserId { get; set; }
        public required string Name { get; set; }

        public string PasswordHash { get; set; }

        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
