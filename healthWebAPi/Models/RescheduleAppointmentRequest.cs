public class RescheduleAppointmentRequest
{
    public int AppointmentId { get; set; }
    public int SlotId { get; set; }
    public int DoctorId { get; set; }
     public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}