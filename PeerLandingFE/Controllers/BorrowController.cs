using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class BorrowController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
