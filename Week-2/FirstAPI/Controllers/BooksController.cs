using FirstAPI.Data;
using FirstAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirstAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        //static private List<Book> books = new List<Book>
        //{
        //    new Book
        //    {
        //        Id = 1,
        //        Title = "The Great Gatsby",
        //        Author = "F. Scott Fitzgerald",
        //        YearPublished = 1925
        //    },
        //    new Book
        //    {
        //        Id = 2,
        //        Title = "To Kill a Mockingbird",
        //        Author = "Harper Lee",
        //        YearPublished = 1960
        //    },
        //    new Book
        //    {
        //        Id = 3,
        //        Title = "1984",
        //        Author = "George Orwell",
        //        YearPublished = 1949
        //    },
        //    new Book
        //    {
        //        Id = 4,
        //        Title = "Pride and Prejudice",
        //        Author = "Jane Austen",
        //        YearPublished = 1813
        //    },
        //    new Book
        //    {
        //        Id = 5,
        //        Title = "The Hobbit",
        //        Author = "J.R .R. Tolkien",
        //        YearPublished = 1937
        //    }
        // };
        private readonly FirstAPIContext _context;
        public BooksController(FirstAPIContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<List<Book>>> getBooks()
        {
            return Ok(await _context.Books.ToListAsync());
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> getBookById(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();
            return Ok(book);
        }
        [HttpPost]
        public async Task<ActionResult<Book>> AddBook(Book newBook)
        {
            if (newBook == null)
                return BadRequest();
            _context.Books.Add(newBook);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(getBookById), new { id = newBook.Id }, newBook);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, Book updateBook)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            book.Id = updateBook.Id;
            book.Title = updateBook.Title;
            book.Author = updateBook.Author;
            book.YearPublished = updateBook.YearPublished;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {

            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();


        }

    }
}
