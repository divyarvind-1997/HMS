using Microsoft.EntityFrameworkCore;
using MyWebApiProjectDemo.Data;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// ✅ DB Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Controllers
builder.Services.AddControllers();

// ✅ OpenAPI (for Scalar)
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

// ✅ CORS (Angular)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:4200") // Angular dev server
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// ✅ OpenAPI + Scalar UI
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

// ✅ ENABLE CORS (ONLY ONCE, BEFORE CONTROLLERS)
app.UseCors("AllowAngularApp");

app.MapControllers();

app.Run();
