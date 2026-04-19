using System.Diagnostics;
using System.Globalization;
using CommunityToolkit.Mvvm.Messaging;

namespace TableWise
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            MainPage = new TableWise.Views.LoadingPage();




            string savedTheme = Preferences.Default.Get("AppTheme", "Unspecified");

            if (Enum.TryParse(savedTheme, out AppTheme theme))
            {
                Application.Current.UserAppTheme = theme;

            }
        }

        protected override async void OnStart()
        {

            await Task.Delay(2000);

            var access = Connectivity.Current.NetworkAccess;

            if (access == NetworkAccess.Internet)
            {

                MainThread.BeginInvokeOnMainThread(() => {
                    MainPage = new AppShell();
                });
            }
            else
            {
  
                bool retry = await MainPage.DisplayAlert("Error ❌", "No internet connection!", "Retry", "Exit");
                if (retry) OnStart();
                else Quit();
            }
        }

        protected override Window CreateWindow(IActivationState? activationState)
        {

            return new Window(MainPage);
        }

        protected override void OnSleep()
        {

            Preferences.Default.Set("AppTheme", Application.Current.UserAppTheme.ToString());

            WeakReferenceMessenger.Default.Send(new AppSleepMessage());
        }

        protected override void OnResume()
        {
            WeakReferenceMessenger.Default.Send(new AppResumeMessage());
        }
    }
}