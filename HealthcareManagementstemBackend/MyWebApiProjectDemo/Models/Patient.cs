using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MyWebApiProjectDemo.Models
{
    public class Patient
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PatientId { get; set; }


        public string MRN { get; set; } = null!;


        public string FullName { get; set; } = null!;

        public DateTime? DOB { get; set; }

        public string? Gender { get; set; }


        public string Phone { get; set; } = null!;

        public string? Email { get; set; }

        public string? Address { get; set; }

        // SQLite INTEGER (0/1) ↔ C# bool
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}