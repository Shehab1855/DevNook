using System.IdentityModel.Tokens.Jwt;
using WebApplication1.models;
using WebApplication1.models.auth_model;
using WebApplication1.models.dto;

namespace WebApplication1.Repository.Services
{
    public interface IAuthService
    {
        Task<AuthModel> RegisterAsync(RegisterModel model);
        Task<AuthModel> GetTokenAsync(TokenRequestModel model);
        Task<string> AddRoleAsync(AddRoleModel model);
        Task<JwtSecurityToken> CreateJwtToken(ApplicationUser user);
        Task<bool> SendVerificationEmailAsync(ApplicationUser appUser);
        Task<ChangePasswordDto> SendResetPasswordEmailAsync(ApplicationUser appUser);
        Task<AuthModel> loginWithGoogel(ApplicationUser user);
        Task<AuthModel> signinWithGoogel(RegisterModel model);
    }
}
