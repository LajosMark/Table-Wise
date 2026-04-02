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

            // Magyar nyelv
            var hungarianCulture = new System.Globalization.CultureInfo("hu-HU");
            System.Globalization.CultureInfo.DefaultThreadCurrentCulture = hungarianCulture;
            System.Globalization.CultureInfo.DefaultThreadCurrentUICulture = hungarianCulture;

            
            
        }
        protected override Window CreateWindow(IActivationState? activationState)
        {

            return new Window(new AppShell());
        }


        protected override void OnSleep()
        {
            WeakReferenceMessenger.Default.Send(new AppSleepMessage());
        }

        protected override void OnResume()
        {
            WeakReferenceMessenger.Default.Send(new AppResumeMessage());
        }

    }
}