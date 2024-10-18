using WebApplication1.models.auth_model;
using WebApplication1.Repository.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using WebApplication1.models.dto;
using WebApplication1.models;
using Microsoft.Win32;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;



namespace WebApplication1.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager; // Add SignInManager
        public AuthController(IAuthService authService, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager) // Add SignInManager to constructor
        {
            _authService = authService;
            _userManager = userManager;
            _signInManager = signInManager; // Initialize SignInManager
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RegisterAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest();
            }
            await _userManager.ConfirmEmailAsync(user, token);
            // Verify the user by updating the verification status

            return Ok("Email verified successfully.");
        }

        [HttpPut("ForgetPassword", Name = "ForgetPassword")]
        public async Task<IActionResult> ForgetPassword(string Email)
        {
            var user = await _userManager.FindByEmailAsync(Email);
            if (user == null)
                return BadRequest("Email Not Found");
            var result = await _authService.SendResetPasswordEmailAsync(user);
            return Ok(result);
        }

        [HttpPut("ResetPassword", Name = "ResetPassword")]
        public async Task<IActionResult> ResetPassword(ChangePasswordDto model)
        {
            var user = await _userManager.FindByIdAsync(model.Id);

            if (user == null)
            {
                return BadRequest();
            }

            var result = await _userManager.ResetPasswordAsync(user, model.ChangePasswordTokken, model.NewPassword);

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> login([FromBody] TokenRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.GetTokenAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            return Ok(result);
        }


        [HttpPost("addrole")]
        public async Task<IActionResult> AddRoleAsync([FromBody] AddRoleModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.AddRoleAsync(model);

            if (!string.IsNullOrEmpty(result))
                return BadRequest(result);

            return Ok(model);
        }



        [HttpGet("GoogleLogin")]
        public IActionResult GoogleLogin()
        {
            string redirectUrl = Url.Action("GoogleResponse", "Auth", null, Request.Scheme);
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(GoogleDefaults.AuthenticationScheme, redirectUrl);
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        

        [HttpGet("GoogleResponse")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (!result.Succeeded)
            {
                return BadRequest("Error loading external login information.");
            }

            // Check if the user is already registered
            var email = result.Principal.FindFirstValue(ClaimTypes.Email);
            var existingUser = await _userManager.FindByEmailAsync(email);

            if (existingUser != null)
            {
                var loginWithGoogeluser = await _authService.loginWithGoogel(existingUser);
                
                await _signInManager.SignInAsync(existingUser, isPersistent: false);
                return Ok(loginWithGoogeluser);
            }
            else
            {
                // User is not registered, create a new user account
                var newUser = new RegisterModel
                {
                    Username = result.Principal.FindFirstValue(ClaimTypes.Email),
                    Email = result.Principal.FindFirstValue(ClaimTypes.Email),
                    FirstName = result.Principal.FindFirstValue(ClaimTypes.GivenName),
                    LastName = result.Principal.FindFirstValue(ClaimTypes.GivenName),
                                    
                };

                // Create the user
                var createResult = await _authService.signinWithGoogel(newUser);



                if (!createResult.IsAuthenticated)
                    return BadRequest(createResult.Message);

                return Ok(createResult);

               
                
            }
        }


    }
}

