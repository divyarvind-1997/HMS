using healthWebApi;
using Microsoft.EntityFrameworkCore;

namespace healthWebApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Patient> Patients => Set<Patient>();

        public DbSet<Doctor> Doctors => Set<Doctor>();

         public DbSet<Appointment> Appointments { get; set; }

         public DbSet<DoctorTimeSlot> DoctorTimeSlots { get; set; }



    }
}
