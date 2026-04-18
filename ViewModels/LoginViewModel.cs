using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Threading.Tasks;
using TableWise.Services;

namespace TableWise.ViewModels
{
    // A 'partial' marad, de most mi magunk adjuk meg a tulajdonságokat
    public partial class LoginViewModel : ObservableObject
    {
        private string _userEmail = "";
        private string _userPassword = "";
        private string _errorMessage;

        // KÉZZEL MEGÍRT TULAJDONSÁGOK (Így a fordító garantáltan látja őket)
        public string UserEmail
        {
            get => _userEmail;
            set => SetProperty(ref _userEmail, value);
        }

        public string UserPassword
        {
            get => _userPassword;
            set => SetProperty(ref _userPassword, value);
        }

        public string ErrorMessage
        {
            get => _errorMessage;
            set => SetProperty(ref _errorMessage, value);
        }

        // A parancsot is kézzel hozzuk létre
        public IAsyncRelayCommand LoginCommand { get; }

        public LoginViewModel()
        {
            LoginCommand = new AsyncRelayCommand(OnLogin);
        }

        private async Task OnLogin()
        {
            ErrorMessage = string.Empty;

            if (string.IsNullOrWhiteSpace(UserEmail) || string.IsNullOrWhiteSpace(UserPassword))
            {
                ErrorMessage = "Please fill in every field!";
                return;
            }

            // Hívás a DataService-be
            bool success = await DataService.LoginAsync(UserEmail, UserPassword);

            if (success)
            {
                ErrorMessage = null;
                await Shell.Current.GoToAsync("//MainPage");
            }
            else
            {
                ErrorMessage = "Invalid email or password!";
            }
        }
    }
}