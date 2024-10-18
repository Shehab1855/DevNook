using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
using WebApplication1.Controllers;

using WebApplication1.models;

namespace WebApplication1.Repository.Repository.QuestionRepository
{
    public class QuestionRepository : Repositoryg<Question>, IQuestionRepository
    {
        private readonly appDbcontext1 _appDbcontext1;
        public QuestionRepository(appDbcontext1 appDbcontext1) : base(appDbcontext1)
        {
            _appDbcontext1 = appDbcontext1;
        }
        public async Task<QuestionEvent> AddQuestionEvent(QuestionEvent questionEvent)
        {
            await _appDbcontext1.questionEvents.AddAsync(questionEvent);
            await save();
            return questionEvent;

        }

        public async Task<List<QuestionEvent>> GetQuestionEvent(Expression<Func<QuestionEvent, bool>> filter = null, bool tracked = true)
        {
            IQueryable<QuestionEvent> query = _appDbcontext1.questionEvents;
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

        public async Task<QuestionEvent> GetQuestiontEventById(Expression<Func<QuestionEvent, bool>> filter = null, bool tracked = true)
        {
            IQueryable<QuestionEvent> query = _appDbcontext1.questionEvents;
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

        public async Task RemoveQuestionEvent(QuestionEvent questionEvent)
        {
            _appDbcontext1.questionEvents.Remove(questionEvent);
            await save();
        }

        public async Task<Question> UpdateQuestion(Question question)
        {
            question.CreatedDate = DateTime.Now;
            _appDbcontext1.questions.Update(question);
            await _appDbcontext1.SaveChangesAsync();
            return question;
        }

        public async Task<QuestionEvent> UpdateQuestionEvent(QuestionEvent questionEvent)
        {
            questionEvent.eventDate = DateTime.Now;
            _appDbcontext1.questionEvents.Update(questionEvent);
            await _appDbcontext1.SaveChangesAsync();
            return questionEvent;
        }

        public async Task<List<Question>> GetAllQuestion()
        {
            IQueryable<Question> query = _appDbcontext1.questions
                .Include(q => q.appUser)
                .Select(q => new Question
                {
                    Id = q.Id,
                    question = q.question,
                    CreatedDate = q.CreatedDate,
                    UserId = q.UserId,
                    TotalLike = q.TotalLike,
                    TotalComment = q.TotalComment,
                    // Include only the UserName property from the appUser navigation property
                    UserName = q.appUser.UserName
                });

            return await query.ToListAsync();
        }

        public async Task<List<QuestionEvent>> GetAllComment()
        {
            IQueryable<QuestionEvent> query = _appDbcontext1.questionEvents
                .Select(q => new QuestionEvent
                {
                    Id = q.Id,
                    typeEvent = q.typeEvent,
                    eventDate = q.eventDate,
                    userid = q.userid,
                    text = q.text,
                    RateComment = q.RateComment,
                    QuestionId = q.QuestionId,
                    // Include only the UserName property from the appUser navigation property
                    UserName = q.UserName
                }).Where(q => q.typeEvent == "comment");

            return await query.ToListAsync();
        }
    }
}
