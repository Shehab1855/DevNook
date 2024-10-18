
using WebApplication1.models;
using Microsoft.AspNetCore.Identity;
using WebApplication1.Controllers;
using WebApplication1.models.dto;

namespace WebApplication1.Repository.Repository
{
    public class mangeprofilerepository : Repositoryg<ApplicationUser>, ImangeprofileRepository
    {
        private readonly appDbcontext1 _db;
        private readonly UserManager<WebApplication1.models.ApplicationUser> _userManager;
        public mangeprofilerepository(appDbcontext1 db, UserManager<ApplicationUser> userManager) : base(db)
        {
            _db = db;
            _userManager = userManager;

        }

        public async Task<ApplicationUser> Update(ApplicationUser entity)
        {
            _db.Users.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<object> ChangePassword(ApplicationUser entity, ChangePassword changePassword)
        {
            var errors = new List<string>();
            var result = await _userManager.ChangePasswordAsync(entity, changePassword.CurrentPassword, changePassword.NewPassword);
            if (!result.Succeeded)
            {
                errors.AddRange(result.Errors.Select(e => e.Description));
                return errors;
            }
            await save();
            return entity;
        }


    }
}


