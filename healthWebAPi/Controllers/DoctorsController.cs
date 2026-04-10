using healthWebApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace healthWebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DoctorsController(AppDbContext context)
    {
        _context = context;
    }

    // GET all doctors
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var doctors = await _context.Doctors
            .Where(d => d.IsActive)
            .ToListAsync();
        return Ok(doctors);
    }

    // POST create doctor
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Doctor doctor)
    {
        doctor.CreatedAt = DateTime.UtcNow;
        doctor.IsActive = true;

        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();

        return Ok(doctor);
    }

    // GET doctor by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var doctor = await _context.Doctors
            .Where(d => d.IsActive && d.DoctorId == id)
            .FirstOrDefaultAsync();

        if (doctor == null)
        {
            return NotFound($"Doctor with ID {id} not found");
        }

        return Ok(doctor);
    }

    // PUT update doctor
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Doctor updatedDoctor)
    {
        var existingDoctor = await _context.Doctors
            .Where(d => d.IsActive && d.DoctorId == id)
            .FirstOrDefaultAsync();

        if (existingDoctor == null)
        {
            return NotFound($"Doctor with ID {id} not found");
        }

        existingDoctor.FullName = updatedDoctor.FullName;
        existingDoctor.Specialization = updatedDoctor.Specialization;
        existingDoctor.Phone = updatedDoctor.Phone;
        existingDoctor.Email = updatedDoctor.Email;
        existingDoctor.LicenseNumber = updatedDoctor.LicenseNumber;
        existingDoctor.Department = updatedDoctor.Department;

        await _context.SaveChangesAsync();

        return Ok(existingDoctor);
    }

    // DELETE doctor (soft delete)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var doctor = await _context.Doctors
            .Where(d => d.IsActive && d.DoctorId == id)
            .FirstOrDefaultAsync();

        if (doctor == null)
        {
            return NotFound($"Doctor with ID {id} not found");
        }

        doctor.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Doctor deleted successfully" });
    }
}
