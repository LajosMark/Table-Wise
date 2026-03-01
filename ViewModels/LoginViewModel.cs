using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TableWise.Services;

namespace TableWise.ViewModels
{
    public partial class LoginViewModel : ObservableObject
    {
        [ObservableProperty]
        private string email = "";

        [ObservableProperty]
        private string password = "";

        [ObservableProperty]
        private string errorMessage;

        [RelayCommand]
        private async void onLogin()
        {
            ErrorMessage = await DataService.login(Email, Password);
            if (ErrorMessage == null)
            {
                await Shell.Current.GoToAsync("//MainPage");
            }
        }
    }
}
