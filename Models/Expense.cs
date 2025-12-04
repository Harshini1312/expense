namespace UseCaseWeb.Models
{
    public class Expense
    {

        public int ExpenseId { get; set; }
        public int UserId { get; set; }

        public decimal AmountSpent { get; set; }

        public int CategoryId { get; set; }

        public required string Description { get; set; }
        public DateTime? SpendDate { get; set; }
       
        public Category? Category { get; set; }
        
        public User? User{ get; set; }

    }
}
