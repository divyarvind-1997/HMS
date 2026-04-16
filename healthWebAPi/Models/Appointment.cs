using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace healthWebApi
{
    public class Appointment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AppointmentId { get; set; }
         public int PatientId { get; set; }
         [ForeignKey(nameof(PatientId))]
        public Patient? Patient { get; set; }
        public int DoctorId { get; set; }
        [ForeignKey(nameof(DoctorId))]
        public Doctor? Doctor { get; set; }
 public int SlotId { get; set; }
          [ForeignKey(nameof(SlotId))]

    public DoctorTimeSlot? Slot { get; set; } 
    public DateTime AppointmentDate { get; set; }  
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public string? Reason { get; set; }
    public string? CancelReason { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
public bool IsActive {get; set;}
}
}

public enum AppointmentStatus
{
    Scheduled = 1,
    Rescheduled = 2,
    Cancelled = 3
}