using System.Windows.Input;
using System.Xml.Linq;
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
                getUser();
            }
        }

        public bool isLoggedIn { get; set; }

        public bool isNotLoggedIn { get => !isLoggedIn; }

        public ICommand logoutCommand { get; set; }
        public AppShell()
        {
            InitializeComponent();

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
    }
}
