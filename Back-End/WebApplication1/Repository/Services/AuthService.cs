using AutoMapper;
using WebApplication1.Helpers;
using WebApplication1.models;
using WebApplication1.models.auth_model;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication1.models;
using System.Web;
using WebApplication1.models.dto;
namespace WebApplication1.Repository.Services
{
    public class AuthService : IAuthService

    {
        private readonly UserManager<WebApplication1.models.ApplicationUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly JWT _jwt;
       
        public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IOptions<JWT> jwt , IEmailService emailService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwt = jwt.Value;
            _emailService = emailService;
           
        }

        
        
       
       public async Task<string> AddRoleAsync(AddRoleModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user is null || !await _roleManager.RoleExistsAsync(model.Role))
                return "Invalid user ID or Role";

            if (await _userManager.IsInRoleAsync(user, model.Role))
                return "User already assigned to this role";

            var result = await _userManager.AddToRoleAsync(user, model.Role);

            return result.Succeeded ? string.Empty : "Sonething went wrong";
        }

        public async  Task<AuthModel> GetTokenAsync(TokenRequestModel model)
        {
            var authModel = new AuthModel();

            var user = await _userManager.FindByEmailAsync(model.Email);
          

            if (user is null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                authModel.Message = "Email or Password is incorrect!";
                return authModel;
            }

            var jwtSecurityToken = await CreateJwtToken(user);
            var rolesList = await _userManager.GetRolesAsync(user);

            authModel.IsAuthenticated = true;
            authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            authModel.Email = user.Email;
            authModel.Username = user.UserName;
            authModel.ExpiresOn = jwtSecurityToken.ValidTo;
            authModel.Roles = rolesList.ToList();

            return authModel;
        }


        public async Task<AuthModel> RegisterAsync(RegisterModel model)
        {
            if (await _userManager.FindByEmailAsync(model.Email) is not null)
                return new AuthModel { Message = "Email is already registered!" };

            if (await _userManager.FindByNameAsync(model.Username) is not null)
                return new AuthModel { Message = "Username is already registered!" };

            // Check if the "User" role exists, and create it if not
            if (!await _roleManager.RoleExistsAsync("User"))
            {
                var userRole = new IdentityRole("User");
                await _roleManager.CreateAsync(userRole);
            }

            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                fname = model.FirstName,
                lname = model.LastName,
                Birthdate = model.Birthdate,
                PhoneNumber = model.PhoneNumber
            };
            await SendVerificationEmailAsync(user);

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                var errors = string.Empty;

                foreach (var error in result.Errors)
                    errors += $"{error.Description},";

                return new AuthModel { Message = errors };
            }

            // Assign the user to the "User" role
            await _userManager.AddToRoleAsync(user, "User");

            var jwtSecurityToken = await CreateJwtToken(user);

            return new AuthModel
            {
                Email = user.Email,
                ExpiresOn = jwtSecurityToken.ValidTo,
                IsAuthenticated = true,
                Roles = new List<string> { "User" },
                Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
                Username = user.UserName
            };
        }

        public async Task<bool> SendVerificationEmailAsync(ApplicationUser appUser)
        {
            try
            {
                var confirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);
                var verificationLink = $"https://localhost:7134/api/Auth/verify?userId={(appUser.Id)}&token={HttpUtility.UrlEncode(confirmationToken)}";
                var emailContent = $"Please click <a href='{verificationLink}'>here</a> to verify your email address.";
                await _emailService.SendAsync("devnook@info.com", appUser.Email, "Please confirm your email", emailContent);

                return true;

            }
            catch
            {
                return false;
            }

        }
        //public async Task<ChangePasswordDto> SendResetPasswordEmailAsync(ApplicationUser appUser)
        //{

        //    var confirmationToken = await _userManager.GeneratePasswordResetTokenAsync(appUser);
        //    var verificationLink = $"https://jwt.io/";
        //    var verificationLink = $"https://localhost:7134/api/Auth/verify?userId={(appUser.Id)}&token={HttpUtility.UrlEncode(confirmationToken)}";
        //    var emailContent = $"Please click <a href='{verificationLink}'>here</a> to change your password.";
        //    var emailContent = $"Dear {appUser.UserName},\n\nYou have requested to reset your password. Please click on the link below to proceed:\n\n{verificationLink}\n\nIf you did not request this change, please ignore this email.\n\nRegards,\nYour Company Name";

        //    await _emailService.SendAsync("negan@gmail.com", appUser.Email, "Reset your password", emailContent);

        //    var model = new ChangePasswordDto
        //    {
        //        Id = appUser.Id,
        //        NewPassword = null,
        //        ChangePasswordTokken = confirmationToken,
        //    };

        //    return model;


        //}

        public async Task<ChangePasswordDto> SendResetPasswordEmailAsync(ApplicationUser appUser)
        {
            // Validate email address
            if (!IsValidEmail(appUser.Email))
            {
                // Handle invalid email address
                throw new ArgumentException("Invalid email address.", nameof(appUser.Email));
            }

            var confirmationToken = await _userManager.GeneratePasswordResetTokenAsync(appUser);
            var verificationLink = $"http://localhost:3000/newpassword?userId={(appUser.Id)}&token={HttpUtility.UrlEncode(confirmationToken)}";

            var emailContent = $"Dear {appUser.UserName},\n\nYou have requested to reset your password. Please click on the link below to proceed:\n\n{verificationLink}\n\nIf you did not request this change, please ignore this email.\n\nRegards,\nstack-hup";

            await _emailService.SendAsync("devnook@info.com", appUser.Email, "Reset Your Password", emailContent);

            var model = new ChangePasswordDto
            {
                Id = appUser.Id,
                NewPassword = null,
                ChangePasswordTokken = confirmationToken,
            };

            return model;
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }


        public async Task<JwtSecurityToken> CreateJwtToken(ApplicationUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            var roleClaims = new List<Claim>();

            foreach (var role in roles)
                roleClaims.Add(new Claim("roles", role));

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id),
                new Claim("username" , user.UserName)
            }
            .Union(userClaims)
            .Union(roleClaims);

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.Now.AddDays(_jwt.DurationInDays),
                signingCredentials: signingCredentials);

            return jwtSecurityToken;
        }

        public async Task<AuthModel> loginWithGoogel(ApplicationUser user)
        {
            var authModel = new AuthModel();

            var jwtSecurityToken = await CreateJwtToken(user);
            var rolesList = await _userManager.GetRolesAsync(user);

            authModel.IsAuthenticated = true;
            authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            authModel.Email = user.Email;
            authModel.Username = user.UserName;
            authModel.ExpiresOn = jwtSecurityToken.ValidTo;
            authModel.Roles = rolesList.ToList();

            return authModel;
        }

        public async Task<AuthModel> signinWithGoogel(RegisterModel model)
        {
            if (await _userManager.FindByEmailAsync(model.Email) is not null)
                return new AuthModel { Message = "Email is already registered!" };


            // Check if the "User" role exists, and create it if not
            if (!await _roleManager.RoleExistsAsync("User"))
            {
                var userRole = new IdentityRole("User");
                await _roleManager.CreateAsync(userRole);
            }

            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                fname = model.FirstName,
                lname = model.LastName,
                Birthdate = model.Birthdate,
                PhoneNumber = model.PhoneNumber
            };
            await SendVerificationEmailAsync(user);

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded)
            {
                var errors = string.Empty;

                foreach (var error in result.Errors)
                    errors += $"{error.Description},";

                return new AuthModel { Message = errors };
            }

            // Assign the user to the "User" role
            await _userManager.AddToRoleAsync(user, "User");

            var jwtSecurityToken = await CreateJwtToken(user);

            return new AuthModel
            {
                Email = user.Email,
                ExpiresOn = jwtSecurityToken.ValidTo,
                IsAuthenticated = true,
                Roles = new List<string> { "User" },
                Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
                Username = user.UserName
            };
        }

    }
}
