using FirstAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FirstAPI.Data
{
    public class FirstAPIContext : DbContext
    {
        public FirstAPIContext(DbContextOptions<FirstAPIContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    Id = 1,
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    YearPublished = 1925
                },
                new Book
                {
                    Id = 2,
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    YearPublished = 1960
                },
                new Book
                {
                    Id = 3,
                    Title = "1984",
                    Author = "George Orwell",
                    YearPublished = 1949
                },
                new Book
                {
                    Id = 4,
                    Title = "Pride and Prejudice",
                    Author = "Jane Austen",
                    YearPublished = 1813
                },
                new Book
                {
                    Id = 5,
                    Title = "The Hobbit",
                    Author = "J.R .R. Tolkien",
                    YearPublished = 1937
                }

            );
        }

        public DbSet<Book> Books { get; set; }
    }
}
