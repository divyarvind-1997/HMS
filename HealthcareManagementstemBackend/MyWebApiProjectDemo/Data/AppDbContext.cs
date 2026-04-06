using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyWebApiProjectDemo.Models;

namespace MyWebApiProjectDemo.Data
{
   public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }
 
        public DbSet<Patient> Patients => Set<Patient>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
    }
}