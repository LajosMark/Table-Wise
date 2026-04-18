using System.Windows.Input;
using TableWise.Services;
using TableWise.Views;

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
                getUser(); // Frissítjük a felhasználót, ha nyílik a menü
            }
        }

        public bool isLoggedIn { get; set; }
        public bool isNotLoggedIn { get => !isLoggedIn; }

        public bool IsAdminOrManager { get; set; }
        public ICommand logoutCommand { get; set; }

        public AppShell()
        {
            InitializeComponent();
            StartListeningToShake();
            getUser();

            logoutCommand = new Command(() => {
                DataService.Logout(); // A tiszta metódus hívása
                IsPresented = false;
                // Itt dől el hova küldjük ki: LoginPage-re érdemes
                Shell.Current.GoToAsync("//MainPage");
                getUser(); // UI frissítése
            });

            BindingContext = this;
        }

        private async void getUser()
        {
            var user = await DataService.GetCurrentUserAsync();

            if (user != null)
            {
                isLoggedIn = true;
                name = $"{user.name} ({user.role})";

                IsAdminOrManager = (user.role.ToLower() == "admin" || user.role.ToLower() == "manager");

                HeaderContainer.Content = CreateHeader(name);
            }
            else
            {
                isLoggedIn = false;
                IsAdminOrManager = false; // Kijelentkezve senki sem admin
                name = string.Empty;
                HeaderContainer.Content = null;
            }

            OnPropertyChanged(nameof(isLoggedIn));
            OnPropertyChanged(nameof(isNotLoggedIn));
            OnPropertyChanged(nameof(IsAdminOrManager));
            OnPropertyChanged(nameof(name));
        }

        // Segédfüggvény a szebb kódért
        private HorizontalStackLayout CreateHeader(string userName)
        {
            var layout = new HorizontalStackLayout
            {
                Padding = new Thickness(20, 30, 10, 30),
                Spacing = 5
            };

            // 🎨 DINAMIKUS HÁTTÉRSZÍN BEÁLLÍTÁSA
            // Light mód: #F0F5F3 | Dark mód: #252525
            layout.SetAppThemeColor(VisualElement.BackgroundColorProperty,
                                    Color.FromArgb("#F0F5F3"),
                                    Color.FromArgb("#252525"));

            var iconLabel = new Label { Text = "👤", FontSize = 20, VerticalOptions = LayoutOptions.Center };

            var nameLabel = new Label
            {
                Text = userName,
                FontAttributes = FontAttributes.Bold,
                VerticalOptions = LayoutOptions.Center
            };

            // 🎨 DINAMIKUS SZÖVEGSZÍN BEÁLLÍTÁSA a névnek
            // Light mód: #69A481 | Dark mód: Yellow (Sárga)
            nameLabel.SetAppThemeColor(Label.TextColorProperty,
                                       Color.FromArgb("#69A481"),
                                       Colors.Yellow);

            layout.Children.Add(iconLabel);
            layout.Children.Add(nameLabel);

            return layout;
        }

        // --- SHAKE FUNKCIÓ ---

        private void StartListeningToShake()
        {
            if (Accelerometer.Default.IsSupported)
            {
                Accelerometer.Default.ShakeDetected += OnShakeDetected;
                if (!Accelerometer.Default.IsMonitoring)
                {
                    Accelerometer.Default.Start(SensorSpeed.UI);
                }
            }
        }

        private void OnShakeDetected(object sender, EventArgs e)
        {

            MainThread.BeginInvokeOnMainThread(async () =>
            {
                await Shell.Current.GoToAsync("//MainPage");
            });
        }

        protected override void OnParentSet()
        {
            base.OnParentSet();
            if (Parent == null && Accelerometer.Default.IsMonitoring)
            {
                Accelerometer.Default.ShakeDetected -= OnShakeDetected;
                Accelerometer.Default.Stop();
            }
        }
    }
}