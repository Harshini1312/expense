namespace UseCaseWeb.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public required string CategoryName { get; set; }
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
