using Microsoft.AspNetCore.Mvc;

namespace tutorialapp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
