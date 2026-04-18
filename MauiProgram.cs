using CommunityToolkit.Maui;
using Microsoft.Extensions.Logging;
using Microsoft.Maui.Controls.Hosting;
using Microsoft.Maui.Controls.Maps;
using Microsoft.Maui.Hosting;
using TableWise.ViewModels;
using TableWise.Views;
using System.Globalization;

namespace TableWise
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var englishCulture = new CultureInfo("en-US");
            CultureInfo.DefaultThreadCurrentCulture = englishCulture;
            CultureInfo.DefaultThreadCurrentUICulture = englishCulture;

            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .UseMauiMaps()
                .UseMauiCommunityToolkit()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });

            builder.Services.AddSingleton<RegisterView>();
            builder.Services.AddSingleton<RegisterViewModel>();

            builder.Services.AddSingleton<LoginView>();
            builder.Services.AddSingleton<LoginViewModel>();

#if DEBUG
            builder.Logging.AddDebug();
#endif

            return builder.Build();
        }
    }
}
