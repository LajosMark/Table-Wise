using System.Windows.Input;
using System.Xml.Linq;
using TableWise.Services;
using TableWise.Views;
using Microsoft.Maui.Devices.Sensors; // shake funkcióhoz
using Microsoft.Maui.Devices; // shake funkcióhoz

namespace TableWise
{
    public partial class AppShell : Shell
    {

        public string name { get; set; }

        private bool isPresented;

        public bool IsPresented
        {
            get { return isPresented; }
            set
            {
                isPresented = value;
                OnPropertyChanged();
                getUser();
            }
        }

        public bool isLoggedIn { get; set; }

        public bool isNotLoggedIn { get => !isLoggedIn; }

        public ICommand logoutCommand { get; set; }
        public AppShell()
        {
            InitializeComponent();
            StartListeningToShake();

            getUser();

            logoutCommand = new Command(async () => {
                await DataService.logout();
                IsPresented = false;
                await Shell.Current.GoToAsync("//MainPage");
            });

            BindingContext = this;
        }

        private async void getUser()
        {
            var authUser = await DataService.getAuthenticatedUser();
            if (authUser != null)
            {
                // be vagyok jelentkezve
                isLoggedIn = true;
                name = authUser.name;
            }
            else
            {
                // nem vagyok bejelentkezve
                isLoggedIn = false;
                name = null;
            }
            OnPropertyChanged(nameof(isLoggedIn));
            OnPropertyChanged(nameof(isNotLoggedIn));
            OnPropertyChanged(nameof(name));
        }

        // shake funkció

        private void StartListeningToShake()
        {
            if (Accelerometer.Default.IsSupported)
            {
                // Feliratkozunk az eseményre
                Accelerometer.Default.ShakeDetected += OnShakeDetected;

                // Elindítjuk a figyelést
                if (!Accelerometer.Default.IsMonitoring)
                {
                    Accelerometer.Default.Start(SensorSpeed.UI);
                }
            }
        }

        private void OnShakeDetected(object sender, EventArgs e)
        {
            // Ez a sor a Visual Studio Output ablakába ír (Ctrl+Alt+O)
            System.Diagnostics.Debug.WriteLine(">>> SZENZOR: Rázást érzékeltem! <<<");

            MainThread.BeginInvokeOnMainThread(async () =>
            {
                // 1. Felugró ablak - ha ez megnyílik, a szenzor MŰKÖDIK!
                await Shell.Current.DisplayAlert("Szenzor Teszt", "A rázás sikeres!", "OK");

                try
                {
                    // 2. Próbáljuk meg a navigációt
                    await Shell.Current.GoToAsync("//MainPage");
                }
                catch (Exception ex)
                {
                    // Ha a navigációval van baj, itt kiírja miért
                    await Shell.Current.DisplayAlert("Hiba", ex.Message, "OK");
                }
            });
        }

        protected override void OnParentSet()
        {
            base.OnParentSet();
            //    Ha bezárják az appot vagy elnavigálnak, állítsuk le a figyelést
            if (Parent == null && Accelerometer.Default.IsMonitoring)
            {
                Accelerometer.Default.ShakeDetected -= OnShakeDetected;
                Accelerometer.Default.Stop();
            }
        }
    }
}
