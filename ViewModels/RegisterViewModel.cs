using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TableWise.Models;
using TableWise.Services;


namespace TableWise.ViewModels
{
    public partial class RegisterViewModel: ObservableObject
    {
        [ObservableProperty]
        private RegisterModel registerData = new RegisterModel();

        [ObservableProperty]
        private RegErrorModel registerError = new RegErrorModel();

        /// <summary>
        /// onRegisterUserCommand
        /// </summary>
        [RelayCommand]
        private async void onRegisterUser()
        {
            RegisterError = new RegErrorModel();
            RegisterError = await DataService.register(RegisterData);
            if (
                RegisterError.name.Length == 0 &&
                RegisterError.email.Length == 0 &&
                RegisterError.password.Length == 0 &&
                RegisterError.confirm_password.Length == 0
                )
            {
                // nincs hiba
                // üzenet
                await App.Current.MainPage.DisplayAlert("", "Registration successful", "OK");
                await Shell.Current.GoToAsync("//MainPage");
            }
        }
    }
}
