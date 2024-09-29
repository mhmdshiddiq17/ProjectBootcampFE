using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeerLandingFE.DTO.Req;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.API
{
    public class ApiMstUserController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiMstUserController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync("https://localhost:7084/rest/v1/user/GetAllUser");
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
        public async Task<IActionResult> GetUserById(string id)
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
        [HttpPut]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] ReqMstUSerDto reqMstUserDto)
        {
            if (reqMstUserDto == null)
            {
                return BadRequest("Invalid user data");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqMstUserDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"https://localhost:7084/rest/v1/user/Update/{id}", content);
            if (response.IsSuccessStatusCode) {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }else
            {
                return BadRequest("Failed to update user.");
            }

        }
        [HttpPost]
        public async Task<IActionResult> AddUSer([FromBody] ReqAddUserDto reqAddUserDto)
        {
            if(reqAddUserDto == null)
            {
                return BadRequest("Invalid user data");
            }
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqAddUserDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7084/rest/v1/user/Register", content);
            if (response.IsSuccessStatusCode) 
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to update user");
            }
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.DeleteAsync($"https://localhost:7084/rest/v1/user/DeleteUser/{id}");

            if (response.IsSuccessStatusCode)
            {
                return Ok("User deleted successfully.");
            }
            else
            {
                return BadRequest("Failed to delete user.");
            }
        }

       
        
    }
}
