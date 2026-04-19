using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Threading.Tasks;
using TableWise.Models;
using TableWise.Services;

namespace TableWise.ViewModels
{
    public partial class RegisterViewModel : ObservableObject
    {

        private RegisterModel _registerData = new RegisterModel();
        private string _infoMessage;


        public RegisterModel RegisterData
        {
            get => _registerData;
            set => SetProperty(ref _registerData, value);
        }

        public string InfoMessage
        {
            get => _infoMessage;
            set => SetProperty(ref _infoMessage, value);
        }


        public IAsyncRelayCommand RegisterCommand { get; }


        public List<string> Roles { get; } = new List<string> { "employee", "admin", "manager"};

        public RegisterViewModel()
        {

            RegisterData.role = Roles[0];
            RegisterCommand = new AsyncRelayCommand(OnRegisterUser);
        }

        private async Task OnRegisterUser()
        {

            if (RegisterData == null || string.IsNullOrWhiteSpace(RegisterData.email))
            {
                await App.Current.MainPage.DisplayAlert("Error", "Empty data!", "OK");
                return;
            }

            try
            {


                var result = await DataService.RegisterAsync(
                    RegisterData.name,
                    RegisterData.email,
                    RegisterData.password,
                    RegisterData.role);



                if (result.Success)
                {
                    await App.Current.MainPage.DisplayAlert("Succes", "Successful Registration!", "OK");
                    await Shell.Current.GoToAsync("//MainPage");
                }
                else
                {
                    await App.Current.MainPage.DisplayAlert("Server error", result.Message, "OK");
                }
            }
            catch (Exception ex)
            {

                await App.Current.MainPage.DisplayAlert("Crash", ex.Message, "OK");
            }
        }
    }
}