namespace UseCaseWeb.Models.DTO
{
    public class AddExpenseDTO
    {
        
        public decimal AmountSpent { get; set; }
        public required string Description { get; set; }
        public DateTime SpendDate { get; set; }
        public int CategoryId { get; set; }
    }
}
