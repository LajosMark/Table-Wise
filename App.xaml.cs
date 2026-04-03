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

            // 1. Magyar nyelv beállítása
            var hungarianCulture = new CultureInfo("hu-HU");
            CultureInfo.DefaultThreadCurrentCulture = hungarianCulture;
            CultureInfo.DefaultThreadCurrentUICulture = hungarianCulture;

            // 2. Téma visszatöltése a memóriából (Preferences)
            // Ha még sose mentettünk semmit, az alapértelmezett (Unspecified) marad
            string savedTheme = Preferences.Default.Get("AppTheme", "Unspecified");

            if (Enum.TryParse(savedTheme, out AppTheme theme))
            {
                Application.Current.UserAppTheme = theme;

            }
        }

        protected override async void OnStart()
        {
            // 2. ELLENŐRZÉS
            await Task.Delay(2000);

            var access = Connectivity.Current.NetworkAccess;

            if (access == NetworkAccess.Internet)
            {
                // 3. HA VAN NET -> ÁTVÁLTUNK AZ APPSHELL-RE
                MainThread.BeginInvokeOnMainThread(() => {
                    MainPage = new AppShell();
                });
            }
            else
            {
                // 4. HA NINCS NET
                bool retry = await MainPage.DisplayAlert("Hiba ❌", "Nincs internet!", "Újra", "Kilépés");
                if (retry) OnStart();
                else Quit();
            }
        }

        protected override Window CreateWindow(IActivationState? activationState)
        {
            // Itt adjuk vissza az AppShell-t
            return new Window(MainPage);
        }

        protected override void OnSleep()
        {
            // 3. Mentés, mielőtt elaludna az app (Biztonsági mentés)
            // Elmentjük az aktuális témát, hogy újraindításkor tudjuk, mi volt
            Preferences.Default.Set("AppTheme", Application.Current.UserAppTheme.ToString());

            WeakReferenceMessenger.Default.Send(new AppSleepMessage());
        }

        protected override void OnResume()
        {
            WeakReferenceMessenger.Default.Send(new AppResumeMessage());
        }
    }
}