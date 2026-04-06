
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApiProjectDemo.Data;

namespace MyWebApiProjectDemo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PatientsController(AppDbContext context)
    {
        _context = context;
    }

    // ✅ GET all patients
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var patients = await _context.Patients           
            .ToListAsync();
           return Ok(patients);
    }

    // ✅ POST create patient
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Models.Patient patient)
    {
        patient.CreatedAt = DateTime.UtcNow;
        patient.IsActive = true;

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        return Ok(patient);
    }

    // ✅ GET patient by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var patient = await _context.Patients
            .Where(p => p.IsActive && p.PatientId == id)
            .FirstOrDefaultAsync();

        if (patient == null)
        {
            return NotFound($"Patient with ID {id} not found");
        }

        return Ok(patient);
    }

    // ✅ PUT update patient
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Models.Patient updatedPatient)
    {
        var existingPatient = await _context.Patients
            .Where(p => p.IsActive && p.PatientId == id)
            .FirstOrDefaultAsync();

        if (existingPatient == null)
        {
            return NotFound($"Patient with ID {id} not found");
        }

        // Update properties
        existingPatient.MRN = updatedPatient.MRN;
        existingPatient.FullName = updatedPatient.FullName;
        existingPatient.DOB = updatedPatient.DOB;
        existingPatient.Gender = updatedPatient.Gender;
        existingPatient.Phone = updatedPatient.Phone;
        existingPatient.Email = updatedPatient.Email;
        existingPatient.Address = updatedPatient.Address;
        // Don't update CreatedAt or PatientId

        await _context.SaveChangesAsync();

        return Ok(existingPatient);
    }

    // ✅ DELETE patient (soft delete)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var patient = await _context.Patients
            .Where(p => p.IsActive && p.PatientId == id)
            .FirstOrDefaultAsync();

        if (patient == null)
        {
            return NotFound($"Patient with ID {id} not found");
        }

        // Soft delete - set IsActive to false
        patient.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Patient {patient.FullName} has been successfully deleted", patientId = id });
    }
}