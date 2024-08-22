
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // Correct DbSet definition
   public DbSet<RegisterDetails> RegisterDetails { get; set; }
    public DbSet<AdminRegisterDetails> AdminRegisterDetails { get; set; }
    public DbSet<Movie> Movies { get; set; }
    public DbSet<Theater> Theaters { get; set; }
    
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Optional: Configure table names and other configurations here
        modelBuilder.Entity<RegisterDetails>().ToTable("Registerdetails");
        modelBuilder.Entity<AdminRegisterDetails>().ToTable("AdminRegisterDetails");
        modelBuilder.Entity<Movie>().ToTable("Movies");
        modelBuilder.Entity<Theater>().ToTable("Theaters");
       
      
    }

}
