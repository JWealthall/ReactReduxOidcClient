using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace IdentityServer.Users
{
    public class AppUserContext : DbContext
    {
        public AppUserContext() { }
        public AppUserContext(DbContextOptions options) : base(options) { }

        public DbSet<AppUserClaim> AppUserClaims { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=AppUserTest;User Id=sa;Password=PcSt3cH;MultipleActiveResultSets=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Stick stuff in here if you want to do any additions like Unique Keys
            modelBuilder.Entity<AppUser>()
                .HasIndex(i => i.NormalizedEmail)
                .IsUnique();
            modelBuilder.Entity<AppUser>()
                .HasIndex(i => i.NormalizedUsername)
                .IsUnique();

        }
    }
}
