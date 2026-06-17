namespace tutorialapp.Models
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public DateTime DateOfJoining { get; set; }
        public string PhotoFileName { get; set; } = string.Empty;
    }
}