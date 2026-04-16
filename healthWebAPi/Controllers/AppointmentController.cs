using healthWebApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace healthWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentController(AppDbContext context)
        {
            _context = context;
        }

      [HttpPost("create")]
public IActionResult CreateAppointment([FromBody] CreateAppointmentRequest request)
{

    
var slot = _context.DoctorTimeSlots
        .FirstOrDefault(s =>
            s.SlotId == request.SlotId &&
            s.DoctorId == request.DoctorId &&
            !s.IsBooked
        );

    if (slot == null)
        return BadRequest("Selected slot is not available");

var appointment = new Appointment
    {
        PatientId = request.PatientId,
        DoctorId = request.DoctorId,
        SlotId = request.SlotId,
        AppointmentDate = request.AppointmentDate.Date,
        StartTime = slot.StartTime,
        EndTime = slot.EndTime,
        Reason = request.Reason,
        IsActive = true,
        CreatedAt = DateTime.UtcNow
    };

    appointment.CreatedAt = DateTime.UtcNow;
    appointment.IsActive = true;

    _context.Appointments.Add(appointment);
    
    slot.IsBooked = true;

    _context.SaveChanges();

    return Ok(appointment);
}

[HttpGet("appointments")]
public IActionResult GetAppointmentsByPatientId()
{
    var appointments =
    (
        from a in _context.Appointments
        join p in _context.Patients on a.PatientId equals p.PatientId
        join d in _context.Doctors on a.DoctorId equals d.DoctorId
        where d.IsActive && a.IsActive
        orderby a.AppointmentDate descending
        select new
        {
            AppointmentId = a.AppointmentId,
            SlotId = a.SlotId,
            DoctorId = a.DoctorId,
            AppointmentDate = a.AppointmentDate,
            StartTime = a.StartTime,
            EndTime = a.EndTime,
            PatientName = p.FullName,
            DoctorName = d.FullName,
            Specialization = d.Specialization,
            Status = a.Status ==  AppointmentStatus.Scheduled ? "BOOKED" :
                     a.Status == AppointmentStatus.Rescheduled ? "RESHEDULED" : "CANCELLED"
        }
    )
    .ToList();

    return Ok(appointments);
}

[HttpGet("specializations")]
public IActionResult GetDoctorSpecializations()
{
    var specializations = _context.Doctors
        .Where(d => d.IsActive)
        .Select(d => d.Specialization)
        .Distinct()
        .OrderBy(s => s)
        .ToList();

    return Ok(specializations);
}


[HttpPost("reschedule")]
public IActionResult RescheduleAppointment(
    [FromBody] RescheduleAppointmentRequest request
)
{
    var appointment = _context.Appointments
        .FirstOrDefault(a =>
            a.AppointmentId == request.AppointmentId &&
            a.IsActive
        );

    if (appointment == null)
        return NotFound("Appointment not found or already cancelled");

    var oldSlot = _context.DoctorTimeSlots.FirstOrDefault(s =>
        s.DoctorId == appointment.DoctorId &&
        s.SlotDate.Date == appointment.AppointmentDate.Date &&
        s.StartTime == appointment.StartTime
    );

    var newSlot = _context.DoctorTimeSlots.FirstOrDefault(s =>
        s.SlotId == request.SlotId &&
        !s.IsBooked
    );

    if (newSlot == null)
        return BadRequest("Selected slot is not available");

    if (oldSlot != null)
        oldSlot.IsBooked = false;

    newSlot.IsBooked = true;

    appointment.AppointmentDate = newSlot.SlotDate;
    appointment.StartTime = newSlot.StartTime;
    appointment.EndTime = newSlot.EndTime;
    appointment.Status = AppointmentStatus.Rescheduled;

    _context.SaveChanges();

    return Ok(new
    {
        message = "Appointment rescheduled successfully"
    });
}

[HttpPost("timeslots")]
    public IActionResult GetAvailableTimeSlots( [FromBody]GetAvailableSlotsRequest request
    )
    {
 var date = request.AppointmentDate.Date;

    var slots = _context.DoctorTimeSlots
        .Where(s =>
            s.DoctorId == request.DoctorId &&
            s.SlotDate.Date == date &&
            !s.IsBooked
        )
        .ToList()                   
        .OrderBy(s => s.StartTime)   
        .Select(s => new
        {
            slotId = s.SlotId,
            startTime = s.StartTime.ToString(@"hh\:mm"),
            endTime = s.EndTime.ToString(@"hh\:mm")
        })
        .ToList();
    return Ok(slots);

    }

[HttpPut("cancelappointment/{appointmentId}/{reason}")]
public IActionResult CancelAppointment(int appointmentId,string reason)
{
    // 1️⃣ Get appointment
    var appointment = _context.Appointments
        .FirstOrDefault(a => a.AppointmentId == appointmentId && a.IsActive);

    if (appointment == null)
        return NotFound("Appointment not found or already cancelled");

    // 2️⃣ Mark appointment as cancelled
    appointment.Status = AppointmentStatus.Cancelled;
    appointment.CancelReason = reason;
    // appointment.IsActive = false;

    var slot = _context.DoctorTimeSlots.FirstOrDefault(s =>
        s.DoctorId == appointment.DoctorId &&
        s.SlotDate.Date == appointment.AppointmentDate.Date &&
        s.StartTime == appointment.StartTime
    );

    if (slot != null)
    {
        slot.IsBooked = false;
    }

    _context.SaveChanges();

    return Ok(new
    {
        message = "Appointment cancelled successfully"
    });
}


[HttpGet("patient")]
    public IActionResult GetAllPatients()
    {
                 var patients = _context.Patients
            .Where(d => d.IsActive)
            .Select(d => new
            {
                patientId = d.PatientId,
                patientName = d.FullName
            })
            .OrderBy(d => d.patientName)
            .ToList();
        return Ok(patients);

    }

[HttpGet("doctors/{specialization}")]
    public IActionResult GetDoctorsBySpecialization(string specialization)
    {
        if(specialization!=null&& specialization!=string.Empty)
        {
        if(specialization=="All")
                {
                    var doctors = _context.Doctors
            .Where(d => d.IsActive)
            .Select(d => new
            {
                doctorId = d.DoctorId,
                doctorName = d.FullName
            })
            .OrderBy(d => d.doctorName)
            .ToList();
        return Ok(doctors);
                }
                else
                {
                    var doctors = _context.Doctors
            .Where(d => d.IsActive && d.Specialization == specialization)
            .Select(d => new
            {
                doctorId = d.DoctorId,
                doctorName = d.FullName
            })
            .OrderBy(d => d.doctorName)
            .ToList();
        return Ok(doctors);
                }
    }
            else
            {
                return Ok();
            }
    }

[HttpPost("save-availability")]
public IActionResult SaveDoctorAvailability(
    [FromBody] SaveDoctorAvailabilityRequest request
)
{
    
var doctorExists = _context.Doctors.Any(d => d.DoctorId == request.DoctorId);

if (!doctorExists)
{
    return BadRequest($"DoctorId {request.DoctorId} does not exist");
}

    if (request == null || request.Slots == null || !request.Slots.Any())
        return BadRequest("No slots provided");

    var slotDate = request.SlotDate.Date;

    var existingSlots = _context.DoctorTimeSlots
        .Where(s =>
            s.DoctorId == request.DoctorId &&
            s.SlotDate.Date == slotDate
        )
        .ToList();

    if (existingSlots.Any())
        _context.DoctorTimeSlots.RemoveRange(existingSlots);

    var newSlots = request.Slots.Select(s => new DoctorTimeSlot
    {
        DoctorId = request.DoctorId,
        SlotDate = slotDate,
        StartTime = s.StartTime,
        EndTime = s.EndTime,
        IsBooked = false,
        CreatedAt = DateTime.Now
    }).ToList();

    _context.DoctorTimeSlots.AddRange(newSlots);
    _context.SaveChanges();

    return Ok(new
    {
        message = "Doctor availability saved successfully"
    });
}


[HttpGet("counts")]
    public async Task<IActionResult> GetDashboardCounts()
    {
        var result = new DashboardCount
        {
            DoctorCount = await _context.Doctors.CountAsync(),
            PatientCount = await _context.Patients.CountAsync(),
            AppointmentCount = await _context.Appointments.CountAsync()
        };

        return Ok(result);
    }


    }
}