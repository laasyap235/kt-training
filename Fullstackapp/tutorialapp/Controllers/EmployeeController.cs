using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using tutorialapp.Models;

namespace tutorialapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly string _connectionString;

        public EmployeeController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("EmployeeAppCon")
                ?? throw new InvalidOperationException("Connection string not found.");
        }

        private SqlConnection NewConnection() => new(_connectionString);

        // GET: api/Employee
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var employees = new List<Employee>();

            await using var con = NewConnection();
            await con.OpenAsync();

            await using var cmd = new SqlCommand("SELECT EmployeeId, EmployeeName, Department, DateOfJoining, PhotoFileName FROM dbo.Employee", con);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
                employees.Add(new Employee
                {
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    EmployeeName = reader["EmployeeName"].ToString()!,
                    Department = reader["Department"].ToString()!,
                    DateOfJoining = Convert.ToDateTime(reader["DateOfJoining"]),
                    PhotoFileName = reader["PhotoFileName"].ToString()!
                });

            return Ok(employees);
        }

        // POST: api/Employee
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Employee emp)
        {
            await using var con = NewConnection();
            await con.OpenAsync();

            await using var cmd = new SqlCommand(
                "INSERT INTO dbo.Employee (EmployeeName, Department, DateOfJoining, PhotoFileName) VALUES (@Name, @Dept, @Doj, @Photo)", con);

            cmd.Parameters.AddWithValue("@Name", emp.EmployeeName);
            cmd.Parameters.AddWithValue("@Dept", emp.Department);
            cmd.Parameters.AddWithValue("@Doj", emp.DateOfJoining);
            cmd.Parameters.AddWithValue("@Photo", emp.PhotoFileName);

            await cmd.ExecuteNonQueryAsync();
            return Ok("Employee added successfully.");
        }

        [HttpPost("SaveFile")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SaveFile([FromForm] IFormFile file)
        {
            try
            {
                string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Photos");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                string filePath = Path.Combine(uploadsFolder, fileName);

                await using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                return Ok(fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"File upload failed: {ex.Message}");
            }
        }

        // PUT: api/Employee
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Employee emp)
        {
            await using var con = NewConnection();
            await con.OpenAsync();

            await using var cmd = new SqlCommand(
                "UPDATE dbo.Employee SET EmployeeName = @Name, Department = @Dept, DateOfJoining = @Doj, PhotoFileName = @Photo WHERE EmployeeId = @Id", con);

            cmd.Parameters.AddWithValue("@Name", emp.EmployeeName);
            cmd.Parameters.AddWithValue("@Dept", emp.Department);
            cmd.Parameters.AddWithValue("@Doj", emp.DateOfJoining);
            cmd.Parameters.AddWithValue("@Photo", emp.PhotoFileName);
            cmd.Parameters.AddWithValue("@Id", emp.EmployeeId);

            await cmd.ExecuteNonQueryAsync();
            return Ok("Employee updated successfully.");
        }

        // DELETE: api/Employee/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await using var con = NewConnection();
            await con.OpenAsync();

            await using var cmd = new SqlCommand("DELETE FROM dbo.Employee WHERE EmployeeId = @Id", con);
            cmd.Parameters.AddWithValue("@Id", id);

            await cmd.ExecuteNonQueryAsync();
            return Ok("Employee deleted successfully.");
        }
    }
}