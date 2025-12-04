namespace UseCaseWeb.Models.DTO
{
    public class UpdateExpenseDTO
    {
        public int ExpenseId { get; set; }
        public decimal AmountSpent { get; set; }
        public int CategoryId { get; set; }
        public DateTime SpendDate { get; set; }
        public string? Description { get; set; }
    }
}
