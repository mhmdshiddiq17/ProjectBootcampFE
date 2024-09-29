﻿using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.API
{
    public class ApiLoginController : Controller
    {
        private readonly HttpClient _httpClient;
        public ApiLoginController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        [HttpPost]
        public async Task<ActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var json = JsonSerializer.Serialize(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("https://localhost:7084/rest/v1/user/Login", content); 
                
            if(response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Login Failed");
            }
        }
    }
}
