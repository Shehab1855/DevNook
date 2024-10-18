using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using WebApplication1.Controllers;
using WebApplication1.Helpers;
using WebApplication1.models;
using WebApplication1.Repository.Repository;
using WebApplication1.Repository.Repository.ProjectsRepository;
using WebApplication1.Repository.Repository.QuestionRepository;
using WebApplication1.Repository.Services;

namespace WebApplication
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }


        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:3000")
                               .AllowAnyHeader()
                               .AllowAnyMethod();
                    }); 
            });


            services.AddAuthentication(O =>
            {
                O.DefaultAuthenticateScheme = GoogleDefaults.AuthenticationScheme;
                O.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            }).AddGoogle(o =>
            {
                IConfigurationSection GoogleAuthSection = Configuration.GetSection("Authentication:Google");
                o.ClientId = GoogleAuthSection["ClientId"];
                o.ClientSecret = GoogleAuthSection["ClientSecret"];
            });

            services.AddScoped<IChatRepository, ChatRepository>();
            services.AddScoped<IProjectsRepository, ProjectsRepository>();
            services.AddScoped<IQuestionRepository, QuestionRepository>();
            services.AddScoped<IpostRepository, postrepository>();
            services.AddScoped<ImangeprofileRepository, mangeprofilerepository>();
            services.AddScoped<IfriendRepository, friendRepository>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddIdentity<ApplicationUser, IdentityRole>()
                 .AddEntityFrameworkStores<appDbcontext1>()
                 .AddDefaultTokenProviders();
            services.Configure<SmtpSetting>((Configuration.GetSection("SMTP")));
            services.AddSingleton<IEmailService, EmailService>();

            services.Configure<JWT>(Configuration.GetSection("JWT"));
            services.AddDbContext<appDbcontext1>(options =>
               options.UseSqlServer(Configuration.GetConnectionString("defaultsqlconection")),
               ServiceLifetime.Scoped
            );

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(o =>
            {
                o.RequireHttpsMetadata = false;
                o.SaveToken = false;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = Configuration["JWT:Issuer"],
                    ValidAudience = Configuration["JWT:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Key"]))
                };
            });

            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "stack-hup APIs", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "stack-hup APIs v1"));
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseCors("AllowReactApp"); // Apply the CORS policy here

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

    }
}
