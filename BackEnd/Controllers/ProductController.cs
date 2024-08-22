using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

[ApiController]
[Route("[controller]")]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;
 private readonly ILogger<ProductController> _logger;
    public ProductController(ApplicationDbContext context, ILogger<ProductController> logger)
    {
        _context = context;
        _logger = logger;
    }
    public class DistrictRequest
{
    public string District { get; set; }
}
    public class MovieTitleRequest
{
    public string movietitle { get; set; }
}
public class DeleteTheaterRequest{
    public string theatername{get;set;}
    public string movietitle{get;set;}
    public string location{get;set;}
}
public class UpdateAllocatedSeatsRequest
{
    public string TheaterName { get; set; }
    public string MovieTitle { get; set; }
    public string District { get; set; }
    public int AllocatedSeats { get; set; }
}
public class BookingRequest
{
    public Theater details { get; set; }
    public List<string> setnumbers { get; set; }
}
[HttpPost("login")]
public IActionResult Login([FromBody] RegisterDetails loginDetails)
{
    if (ModelState.IsValid)
    {
         
        var user = _context.RegisterDetails.FirstOrDefault(u => u.Email == loginDetails.Email && u.Password == loginDetails.Password);
        if (user != null)
        {
           
            return Ok(new { message = "Successfully Login" });
        }
          
        return Ok(new { message = "Invalid email or password." });
    }
    
    return BadRequest(ModelState);
}


    [HttpPost("register")]
    public IActionResult Register([FromBody]RegisterDetails registerDetails)
    {
        if (ModelState.IsValid)
        {
            var existingUser = _context.RegisterDetails.FirstOrDefault(u => u.Email == registerDetails.Email);
            if (existingUser != null)
            {
                return Ok(new { message = "User already exists." });
            }

            // Add new user to the database
            _context.RegisterDetails.Add(registerDetails);
            _context.SaveChanges();
            return Ok(new { message = "Successfully Registered" });
        }
        return BadRequest(ModelState);
    }


 
    [HttpPost("getmoviedetails")]
public IActionResult GetMovieDetails([FromBody] DistrictRequest movie)
{
    if (movie == null || string.IsNullOrEmpty(movie.District))
    {
        return BadRequest("District is required.");
    }

   // Console.WriteLine("District name: " + movie.District);

    // Fetch movies based on the district provided in the request
    var movies = _context.Movies.AsNoTracking().Where(m => m.district == movie.District).ToList();
    if (movies == null || movies.Count == 0)
    {
        return Ok();
    }
  return Ok(movies); // Return the list of movies directly
}

    [HttpPost("gettheatredetails")]
    public IActionResult GetTheaterDetails([FromBody] MovieTitleRequest search)
    {
       // Console.WriteLine(search.movietitle);
        var theaters = _context.Theaters.AsNoTracking().Where(t => t.movietitle == search.movietitle).ToList();
      //  Console.WriteLine(theaters[0].address);
      if(theaters==null || theaters.Count==0){
        return Ok();
      }
        return Ok(theaters);
    }

   

  [HttpPost("adminlogin")]
public IActionResult AdminLogin([FromBody] AdminRegisterDetails loginDetails)
{
     if (ModelState.IsValid)
    {
       // _logger.LogInformation("Received login request with Email: {Email}, Password: {Password}", loginDetails.Email, loginDetails.Password);

    var user = _context.AdminRegisterDetails.FirstOrDefault(u => u.Email == loginDetails.Email && u.Password == loginDetails.Password);
    if (user != null)
    {
        return Ok(new { message = "Successfully Login" });
    }
    return Ok(new { message = "Invalid email or password." });
    }
    
    return BadRequest(ModelState);
}

    [HttpPost("addnewmovie")]
    public IActionResult AddNewMovie([FromBody] Movie newMovie)
    {
        Console.WriteLine("Add movie title"+newMovie.title);
        if (ModelState.IsValid)
    {
        _context.Movies.Add(newMovie);
        _context.SaveChanges();
        return Ok(new { message = "Successfully Added" });
         }
    
    return BadRequest(ModelState);
    }

[HttpPost("addtheater")]
public IActionResult AddTheater([FromBody] Theater newTheater)
{
        // Add the new theater to the context
        _context.Theaters.Add(newTheater);
        _context.SaveChanges();
         return Ok(new { message = "Successfully Added" });
}

 
    [HttpPost("deletemovie")]
public IActionResult DeleteMovie([FromBody] MovieTitleRequest movieToDelete)
{
    if (movieToDelete == null || string.IsNullOrEmpty(movieToDelete.movietitle))
    {
        return BadRequest(new { message = "Invalid data provided." });
    }
    var result = _context.Movies
        .Where(t => t.title == movieToDelete.movietitle)
        .FirstOrDefault();
    Console.WriteLine(result.title);
      var result1 = _context.Theaters
        .Where(t => t.movietitle == movieToDelete.movietitle)
        .FirstOrDefault();

    if (result == null)
    {
         return NotFound(new { message = "Movie not found." });
    }

    try
    {
        _context.Movies.Remove(result);
         _context.Theaters.Remove(result1);
        _context.SaveChanges();
        return Ok(new { message = "Successfully Deleted" });
    }
    catch (DbUpdateConcurrencyException ex)
    {
       return StatusCode(409, new { message = "Concurrency issue detected. Please try again." });
    }
    catch (Exception ex)
    {
          return StatusCode(500, new { message = "An error occurred. Please try again later." });
    }
}

   
[HttpPost("deletetheatre")]
public IActionResult DeleteTheater([FromBody] DeleteTheaterRequest theaterToDelete)
{
    if (theaterToDelete == null || string.IsNullOrEmpty(theaterToDelete.theatername) ||
        string.IsNullOrEmpty(theaterToDelete.movietitle) || string.IsNullOrEmpty(theaterToDelete.location))
    {
        return BadRequest(new { message = "Invalid data provided." });
    }

   
    var result = _context.Theaters
        .Where(t => t.theatername == theaterToDelete.theatername &&
                    t.movietitle == theaterToDelete.movietitle &&
                    t.district == theaterToDelete.location)
        .FirstOrDefault();

    if (result == null)
    {
          return NotFound(new { message = "Theater not found." });
    }

    try
    {
          _context.Theaters.Remove(result);
        _context.SaveChanges();
          return Ok(new { message = "Successfully Deleted" });
    }
    catch (DbUpdateConcurrencyException ex)
    {
         return StatusCode(409, new { message = "Concurrency issue detected. Please try again." });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "An error occurred. Please try again later." });
    }
}

[HttpPost("getbookingtickets")]
public IActionResult GetBookingTickets([FromBody] Theater newTheater)
{
     if (newTheater== null)
        {
            return BadRequest(new { message = "Invalid booking request." });
        }

        // Find the theater by name, movie title, and date
        var theater = _context.Theaters
            .FirstOrDefault(t => t.theatername == newTheater.theatername &&
                                 t.movietitle == newTheater.movietitle &&
                                 t.date == newTheater.date &&
                                 t.time == newTheater.time);

        if (theater == null)
        {
            return NotFound(new { message = "Theater not found." });
        }
          var bookedSeats = theater.allotseats.Split(',').ToList();
          Console.WriteLine(bookedSeats);
        return Ok(new { message = bookedSeats});
}




[HttpPost("bookticket")]
    public IActionResult BookingTicket([FromBody] BookingRequest bookingRequest)
    {
        if (bookingRequest == null || bookingRequest.details == null || bookingRequest.setnumbers == null)
        {
            return BadRequest(new { message = "Invalid booking request." });
        }

        // Find the theater by name, movie title, and date
        var theater = _context.Theaters
            .FirstOrDefault(t => t.theatername == bookingRequest.details.theatername &&
                                 t.movietitle == bookingRequest.details.movietitle &&
                                 t.date == bookingRequest.details.date &&
                                 t.time == bookingRequest.details.time);

        if (theater == null)
        {
            return NotFound(new { message = "Theater not found." });
        }

        // Convert seats string to an array for comparison
        var bookedSeats = theater.allotseats.Split(',').ToList();

        // Check if the requested seats are already booked
        foreach (var seat in bookingRequest.setnumbers)
        {
            Console.WriteLine(seat);
            if (bookedSeats.Contains(seat))
            {
                return Conflict(new { message = $"Seat {seat} is already booked." });
            }
        }

   
        bookedSeats.AddRange(bookingRequest.setnumbers);

        theater.allotseats = string.Join(",", bookedSeats);
        //Console.WriteLine();
        _context.Theaters.Update(theater);
        _context.SaveChanges();

        return Ok(new { message = "Successfully booked" });
    }

}
