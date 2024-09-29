using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class LenderController : Controller
    {
        private readonly ILogger<LenderController> _logger;
        public LenderController(ILogger<LenderController> logger)
        {
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult HistoryFundedLender()
        {
            return View();
        }
    }
}
