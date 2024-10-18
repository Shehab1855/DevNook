namespace WebApplication1.Repository.Services
{
    public interface IEmailService
    {
        Task SendAsync(string from, string to, string subject, string body);

    }
}
