using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using WebApplication1.models;

namespace WebApplication1.Repository.Repository.QuestionRepository
{
    public interface IQuestionRepository: IRepository<Question>
    {
        Task<QuestionEvent> UpdateQuestionEvent(QuestionEvent questionEvent);
        Task<Question> UpdateQuestion(Question question);
        Task<List<QuestionEvent>> GetQuestionEvent(Expression<Func<QuestionEvent, bool>> filter = null, bool tracked = true);
        Task<QuestionEvent> AddQuestionEvent(QuestionEvent questionEvent);
        Task<QuestionEvent> GetQuestiontEventById(Expression<Func<QuestionEvent, bool>> filter = null, bool tracked = true);
        Task RemoveQuestionEvent(QuestionEvent entity);
        Task<List<Question>> GetAllQuestion();
        Task<List<QuestionEvent>> GetAllComment();
    }
}
