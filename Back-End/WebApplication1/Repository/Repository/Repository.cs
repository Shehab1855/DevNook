using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using WebApplication1.Controllers;
using WebApplication1.Controllers;

using WebApplication1.models;
using WebApplication1.models.dto;

namespace WebApplication1.Repository
{
    public class Repositoryg<T> : IRepository<T> where T : class
    {
        private readonly appDbcontext1 _db;
        internal DbSet<T> dbset;

        public Repositoryg(appDbcontext1 db)
        {
            _db = db;
            this.dbset = _db.Set<T>();
        }

        public async Task Create(T entity)
        {
            await dbset.AddAsync(entity);
            await _db.SaveChangesAsync();
        }


        public async Task Addnotification(notification notification)
        {
            await _db.notifications.AddAsync(notification);
            await _db.SaveChangesAsync();
        }

        public async Task<T> Get(Expression<Func<T, bool>>? filter = null, bool track = true)
        {
            IQueryable<T> qurey = dbset;
            if (!track) { qurey = qurey.AsNoTracking(); }
            if (filter != null) { qurey = qurey.Where(filter); }
            return await qurey.FirstOrDefaultAsync();
        }

        public async Task<List<T>> GetAll(Expression<Func<T, bool>> filter = null)
        {
            IQueryable<T> qurey = dbset;
            if (filter != null) { qurey = qurey.Where(filter); }
            return await qurey.ToListAsync();
        }

       
        public async Task<List<TEntity>> GetAllTEntity<TEntity>(Expression<Func<TEntity, bool>> filter = null, bool tracked = true) where TEntity : class
        {
            IQueryable<TEntity> query = _db.Set<TEntity>(); 

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (!tracked)
            {
                query = query.AsNoTracking();
            }

            return await query.ToListAsync();
        }




        public async Task<TEntity> GetSpecialEntity<TEntity>(Expression<Func<TEntity, bool>> filter = null, bool tracked = true) where TEntity : class
        {
            IQueryable<TEntity> query = _db.Set<TEntity>(); 

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (!tracked)
            {
                query = query.AsNoTracking();
            }

            return await query.FirstOrDefaultAsync();
        }


        public async Task Remove<TEntity>(TEntity entity) where TEntity : class
        {
            var dbSet = _db.Set<TEntity>();
            dbSet.Remove(entity);
            await save();
        }

        public async Task Remove(T entity)
        {
            dbset.Remove(entity);

            await save();
        }



      
        public async Task Detach(T entity)
        {
            _db.Entry(entity).State = EntityState.Detached;
        }

        public async Task<HashSet<string>> GetUserFriends(ApplicationUser user)
        {
            // Assuming you have a navigation property named 'Friendships' in your ApplicationUser class
            var friendships = await _db.Friendships
                                             .Where(f => f.ApplicationUser1Id == user.Id || f.ApplicationUser2Id == user.Id)
                                             .ToListAsync();

            var friendIds = friendships.Select(f =>
                                    f.ApplicationUser1Id == user.Id ? f.ApplicationUser2Id : f.ApplicationUser1Id)
                                    .ToHashSet();

            return friendIds;
        }
        public async Task<HashSet<string>> GetUserblock(ApplicationUser user)
        {
            
            var Userblock = await _db.blockusers
                                             .Where(f => f.ApplicationUser1Id == user.Id )
                                             .ToListAsync();

            var Userblockides = Userblock.Select(f =>
                                    f.ApplicationUser1Id == user.Id ? f.ApplicationUser2Id : f.ApplicationUser1Id)
                                    .ToHashSet();

            return Userblockides;
        }

        public async Task save()
        {
            await _db.SaveChangesAsync();
        }
    }
}