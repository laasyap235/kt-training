var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// Ensure Photos folder exists before serving static files
string photosFolder = Path.Combine(Directory.GetCurrentDirectory(), "Photos");
if (!Directory.Exists(photosFolder))
    Directory.CreateDirectory(photosFolder);

app.UseCors("AllowOrigin");

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(photosFolder),
    RequestPath = "/Photos"
});

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();