using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using WebApplication1.Controllers;
using WebApplication1.models;


namespace WebApplication1.Repository.Repository


{
    public class postrepository : Repositoryg<post>, IpostRepository
    {
        private readonly appDbcontext1 _db;
        private readonly UserManager<ApplicationUser> _userManager;
        public postrepository(appDbcontext1 db, UserManager<ApplicationUser> userManager) : base(db)
        {
            _db = db;
            _userManager = userManager;
        }


        public async Task AddEvent(evnet evnet)
        {
            await _db.evnets.AddAsync(evnet);

            await save();
            
        }


        


        public async Task<post> update(post entity)
        {
            entity.CreatedDate = DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm tt");
            _db.posts.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }




    }
}