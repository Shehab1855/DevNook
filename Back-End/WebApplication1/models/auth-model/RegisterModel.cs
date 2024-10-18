using System.ComponentModel.DataAnnotations;

namespace WebApplication1.models.auth_model
{
    public class RegisterModel
    {

         
        [Required, StringLength(100)]
        public string FirstName { get; set; }

        [Required, StringLength(100)]
        public string LastName { get; set; }

        [Required, StringLength(50)]
        public string Username { get; set; }

        [Required, StringLength(128)]
        public string Email { get; set; }

        [Required, StringLength(256)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Please enter your birthdate")]
        [Display(Name = "Birthdate")]
        [DataType(DataType.Date)]
        public DateTime Birthdate { get; set; }

        [Required, StringLength(20)]
        [RegularExpression(@"^\+?[0-9]{0,3}\s?[0-9]{6,12}$", ErrorMessage = "Invalid phone number")]
        public string PhoneNumber { get; set; }
     

    }
}
