using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeerLandingFE.DTO.Req;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.API
{
    public class ApiMstLenderController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiMstLenderController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        [HttpGet]
        public async Task<IActionResult> GetListPeminjam()
        {

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync("https://localhost:7084/rest/v1/lender/GetListPeminjam");
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Login Failed");
            }

        }
        [HttpGet]
        public async Task<IActionResult> GetBalance(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("User ID cannot be null or empty");
            }
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", " ");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7084/rest/v1/user/GetUser/{id}"); //potensi error

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("failed to fetch user");
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateSaldo(string id, decimal amount)
        {
            // Validasi input ID dan amount
            if (string.IsNullOrEmpty(id) || amount <= 0)
            {
                return BadRequest("Invalid user ID or amount.");
            }

            // Mendapatkan token dari header Authorization
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Authorization token is missing.");
            }

            // Menyiapkan header Authorization
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Mempersiapkan URL dengan query string parameter
            var url = $"https://localhost:7084/rest/v1/lender/UpdateSaldo?lenderId={id}&amount={amount}";

            try
            {
                // Membuat permintaan PUT ke endpoint eksternal
                var response = await _httpClient.PutAsync(url, null); // Tidak perlu body karena parameter dikirim via query string

                // Mengecek apakah respons berhasil
                if (response.IsSuccessStatusCode)
                {
                    var jsonData = await response.Content.ReadAsStringAsync();
                    return Ok(jsonData);  // Mengembalikan respons sukses dari API
                }
                else
                {
                    // Mengambil pesan error dari respons API
                    var errorData = await response.Content.ReadAsStringAsync();
                    return BadRequest($"Failed to update lender balance. Error: {errorData}");
                }
            }
            catch (Exception ex)
            {
                // Menangani error ketika melakukan permintaan
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
