using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace tutorialapp.Controllers
{
    public class Department
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly string _connectionString;

        public DepartmentController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("EmployeeAppCon")
                ?? throw new InvalidOperationException("Connection string not found.");
        }

        private SqlConnection NewConnection() => new(_connectionString);

        // GET: api/Department
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var departments = new List<Department>();

            await using var con = NewConnection();
            await con.OpenAsync();

            await using var cmd = new SqlCommand("SELECT DepartmentId, DepartmentName FROM dbo.Department", con);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
                departments.Add(new Department
                {
                    DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                    DepartmentName = reader["DepartmentName"].ToString()!
                });

            return Ok(departments);
        }

        // POST: api/Department
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Department dept)
        {
            await using var con = NewConnection();
            await con.OpenAsync();

            await using var cmd = new SqlCommand("INSERT INTO dbo.Department (DepartmentName) VALUES (@Name)", con);
            cmd.Parameters.AddWithValue("@Name", dept.DepartmentName);

            await cmd.ExecuteNonQueryAsync();
            return Ok("Department added successfully.");
        }

        // PUT: api/Department
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Department dept)
        {
            await using var con = NewConnection();
            await con.OpenAsync();

            await using var cmd = new SqlCommand("UPDATE dbo.Department SET DepartmentName = @Name WHERE DepartmentId = @Id", con);
            cmd.Parameters.AddWithValue("@Name", dept.DepartmentName);
            cmd.Parameters.AddWithValue("@Id", dept.DepartmentId);

            await cmd.ExecuteNonQueryAsync();
            return Ok("Department updated successfully.");
        }

        // DELETE: api/Department/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await using var con = NewConnection();
            await con.OpenAsync();

            await using var cmd = new SqlCommand("DELETE FROM dbo.Department WHERE DepartmentId = @Id", con);
            cmd.Parameters.AddWithValue("@Id", id);

            await cmd.ExecuteNonQueryAsync();
            return Ok("Department deleted successfully.");
        }
    }
}