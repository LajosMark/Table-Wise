using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Threading.Tasks;
using TableWise.Models;
using TableWise.Services;

namespace TableWise.ViewModels
{
    public partial class RegisterViewModel : ObservableObject
    {
        // Belső mezők
        private RegisterModel _registerData = new RegisterModel();
        private string _infoMessage;

        // Manuális tulajdonságok (Brute Force mód 🛡️)
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

        // Parancs kézi létrehozása
        public IAsyncRelayCommand RegisterCommand { get; }

        // Add ezt a listát a RegisterViewModel osztályba
        public List<string> Roles { get; } = new List<string> { "employee", "admin", "manager"};

        public RegisterViewModel()
        {
            // Alapértelmezett érték beállítása, hogy ne legyen üres
            RegisterData.role = Roles[0];
            RegisterCommand = new AsyncRelayCommand(OnRegisterUser);
        }

        private async Task OnRegisterUser()
        {
            // 1. Megálló: Adatok ellenőrzése
            if (RegisterData == null || string.IsNullOrWhiteSpace(RegisterData.email))
            {
                await App.Current.MainPage.DisplayAlert("Error", "Empty data!", "OK");
                return;
            }

            try
            {

                // 2. Megálló: A hálózati hívás előtt
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
                // 4. Megálló: Ha összeomlik a hálózat
                await App.Current.MainPage.DisplayAlert("Crash", ex.Message, "OK");
            }
        }
    }
}