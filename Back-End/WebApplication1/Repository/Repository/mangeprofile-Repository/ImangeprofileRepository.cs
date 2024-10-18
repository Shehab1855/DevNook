

using WebApplication1.models;
using WebApplication1.models.dto;

namespace WebApplication1.Repository.Repository
{
    public interface ImangeprofileRepository : IRepository<ApplicationUser>
    {

        public Task<ApplicationUser> Update(ApplicationUser entity);
        public Task<object> ChangePassword(ApplicationUser entity, ChangePassword changePassword);

    }
}
