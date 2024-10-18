using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
using WebApplication1.Controllers;
using WebApplication1.models;

namespace WebApplication1.Repository.Repository.ProjectsRepository
{
    public class ProjectsRepository : Repositoryg<Projects> ,IProjectsRepository
    {

        private readonly appDbcontext1 _appDbcontext1;
        public ProjectsRepository(appDbcontext1 appDbcontext1) : base(appDbcontext1)
        {
            _appDbcontext1 = appDbcontext1;
        }
        public async Task<ProjectEvent> AddProjectEvent(ProjectEvent ProjectEvent)
        {
            await _appDbcontext1.projectEvents.AddAsync(ProjectEvent);

            await save();
            return ProjectEvent;
        }
        public async Task<string> WriteFile(IFormFile file)
        {

            string filename = "";
            var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
            filename = DateTime.Now.Ticks.ToString() + extension;

            // Define your desired path
            var filepath = @"C:\Users\aminm\OneDrive\Desktop\project\New folder\FinalONEfromMaiiii\public\projectFiles";
        
            // Create the directory if it doesn't exist
            if (!Directory.Exists(filepath))
            {
                Directory.CreateDirectory(filepath);
            }

            // Combine the path with the filename
            var exactpath = Path.Combine(filepath, filename);

            // Save the file to the specified path
            using (var stream = new FileStream(exactpath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return filename;
        }
        public async Task<Projects> GetFileById(Expression<Func<Projects, bool>> filter = null, bool tracked = true)
        {
            IQueryable<Projects> query = _appDbcontext1.projects;
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
        public async Task<List<Projects>> GetAllProjects()
        {
            IQueryable<Projects> query = _appDbcontext1.projects
                .Include(q => q.AppUser)
                .Select(q => new Projects
                {
                    Id = q.Id,
                    FileName = q.FileName,
                    FilePath = q.FilePath,
                    UserId = q.UserId,
                    totallike = q.totallike,
                    totaldislike = q.totaldislike,
                    totalcomment = q.totalcomment,
                    Brief=q.Brief,
                    Status=q.Status,
                    // Include only the UserName property from the appUser navigation property
                    UserName = q.AppUser.UserName
                });

            return await query.ToListAsync();
        }

        public async Task<List<Projects>> GetAllPendingProjects()
        {
            IQueryable<Projects> query = _appDbcontext1.projects
                .Include(q => q.AppUser)
                .Select(q => new Projects
                {
                    Id = q.Id,
                    FileName = q.FileName,
                    FilePath = q.FilePath,
                    UserId = q.UserId,
                    totallike = q.totallike,
                    totaldislike = q.totaldislike,
                    totalcomment = q.totalcomment,
                    Brief = q.Brief,
                    Status = q.Status,
                    // Include only the UserName property from the appUser navigation property
                    UserName = q.AppUser.UserName
                }).Where(q => q.Status == "Pending");

            return await query.ToListAsync();
        }

        public async Task<List<Projects>> GetAllApprovedProjects()
        {
            IQueryable<Projects> query = _appDbcontext1.projects
                .Include(q => q.AppUser)
                .Select(q => new Projects
                {
                    Id = q.Id,
                    FileName = q.FileName,
                    FilePath = q.FilePath,
                    UserId = q.UserId,
                    totallike = q.totallike,
                    totaldislike = q.totaldislike,
                    totalcomment = q.totalcomment,
                    Brief = q.Brief,
                    Status = q.Status,
                    // Include only the UserName property from the appUser navigation property
                    UserName = q.AppUser.UserName
                }).Where(q => q.Status == "Approved");

            return await query.ToListAsync();
        }
        public async Task<List<Projects>> GetAllRejectedProjects()
        {
            IQueryable<Projects> query = _appDbcontext1.projects
                .Include(q => q.AppUser)
                .Select(q => new Projects
                {
                    Id = q.Id,
                    FileName = q.FileName,
                    FilePath = q.FilePath,
                    UserId = q.UserId,
                    totallike = q.totallike,
                    totaldislike = q.totaldislike,
                    totalcomment = q.totalcomment,
                    Brief = q.Brief,
                    Status = q.Status,
                    // Include only the UserName property from the appUser navigation property
                    UserName = q.AppUser.UserName
                }).Where(q => q.Status == "Rejected");

            return await query.ToListAsync();
        }

        public async Task<ProjectEvent> GetProjectEventById(Expression<Func<ProjectEvent, bool>> filter = null, bool tracked = true)
        {
            IQueryable<ProjectEvent> query = _appDbcontext1.projectEvents;
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

        //public async Task<List<ProjectEvent>> GetProjectEvent(Expression<Func<ProjectEvent, bool>> filter = null, bool tracked = true)
        //{
        //    IQueryable<ProjectEvent> query = _appDbcontext1.projectEvents;
        //    if (filter != null)
        //    {
        //        query = query.Where(filter);
        //    }
        //    if (!tracked)
        //    {
        //        query = query.AsNoTracking();
        //    }
        //    return await query.ToListAsync();

        //}

        //public async Task<ProjectEvent> GetSpeciaProjectEvent(Expression<Func<ProjectEvent, bool>> filter = null, bool tracked = true)
        //{
        //    IQueryable<ProjectEvent> query = _appDbcontext1.projectEvents;
        //    if (filter != null)
        //    {
        //        query = query.Where(filter);
        //    }
        //    if (!tracked)
        //    {
        //        query = query.AsNoTracking();
        //    }
        //    return await query.FirstOrDefaultAsync();

        //}


        //public async Task RemoveProjectEvent(ProjectEvent entity)
        //{
        //   _appDbcontext1.projectEvents.Remove(entity);
        //    await save();
        //}





        //public async Task<byte[]> GetFileDataAsync(int fileId)
        //{

        //    var file = await _appDbcontext1.projects.FirstOrDefaultAsync(f => f.Id == fileId);

        //    return file?.FileData; 
        //}
        //public async Task<string> GetFileNameAsync(int fileId)
        //{

        //    var file = await _appDbcontext1.projects.FirstOrDefaultAsync(f => f.Id == fileId);

        //    return file?.FileName;
        //}
        //public async Task<List<Projects>> GetAllFilesAsync()
        //{
        //    return await _appDbcontext1.projects.ToListAsync();
        //}
    }
}
