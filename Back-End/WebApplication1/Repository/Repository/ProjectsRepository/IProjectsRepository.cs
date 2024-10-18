using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Elfie.Model.Strings;
using System.Linq.Expressions;
using WebApplication1.models;

namespace WebApplication1.Repository.Repository.ProjectsRepository
{
    public interface IProjectsRepository:IRepository<Projects>
    {
        Task<ProjectEvent> AddProjectEvent(ProjectEvent ProjectEvent);
        Task<string> WriteFile(IFormFile file);
        Task<Projects> GetFileById(Expression<Func<Projects, bool>> filter = null, bool tracked = true);
        Task<List<Projects>> GetAllProjects();
        Task<ProjectEvent> GetProjectEventById(Expression<Func<ProjectEvent, bool>> filter = null, bool tracked = true);
         Task<List<Projects>> GetAllPendingProjects();
        Task<List<Projects>> GetAllApprovedProjects();
        Task<List<Projects>> GetAllRejectedProjects();
        //Task<ProjectEvent> GetSpeciaProjectEvent(Expression<Func<ProjectEvent, bool>> filter = null, bool tracked = true);
        //Task RemoveProjectEvent(ProjectEvent entity);
        // Task<List<ProjectEvent>> GetProjectEvent(Expression<Func<ProjectEvent, bool>> filter = null, bool tracked = true);
    }
}
