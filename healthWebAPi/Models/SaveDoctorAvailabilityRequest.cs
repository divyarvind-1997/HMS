public class SaveDoctorAvailabilityRequest
{
    public int DoctorId { get; set; }
    public DateTime SlotDate { get; set; }     // date only
    public List<TimeSlotDto> Slots { get; set; }
}

public class TimeSlotDto
{
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}
