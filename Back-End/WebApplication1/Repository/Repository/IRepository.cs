using System.Linq.Expressions;
using WebApplication1.models;

namespace WebApplication1.Repository
{
    public interface IRepository<T> where T : class
    {
        Task Create(T entity);
        public Task save();
        Task Remove(T entity);

        Task<List<T>> GetAll(Expression<Func<T, bool>>? filter = null);
        
        Task<T> Get(Expression<Func<T, bool>>? filter = null, bool track = true);


        Task<List<TEntity>> GetAllTEntity<TEntity>(Expression<Func<TEntity, bool>> filter = null, bool tracked = true) where TEntity : class;


        Task<TEntity> GetSpecialEntity<TEntity>(Expression<Func<TEntity, bool>> filter = null, bool tracked = true) where TEntity : class;
        Task<HashSet<string>> GetUserFriends(ApplicationUser user);
        Task<HashSet<string>> GetUserblock(ApplicationUser user);
        Task Remove<TEntity>(TEntity entity) where TEntity : class;

        Task Detach(T entity);
        Task Addnotification(notification notification);

    }
}