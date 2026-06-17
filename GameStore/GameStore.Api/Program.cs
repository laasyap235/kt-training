using System.Net.NetworkInformation;
using GameStore.Api.Dtos;
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

List<GameDto> games = [
    new(1,
    "Street Fighter", 
    "Fiction", 
    19.99M, 
    new DateOnly(1999, 2, 15)),
     new(2,
    "Game Fight",
    "Fighting",
    29.99M,
    new DateOnly(1995, 12, 25)),
     new(3,
    "Demise",
    "Fiction",
    45.67M,
    new DateOnly(1999, 7, 5))

 ];

// Get /games
app.MapGet("/games", () => games);

app.Run();
