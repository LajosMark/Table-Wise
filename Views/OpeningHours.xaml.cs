using Microsoft.Maui.Devices.Sensors;

namespace TableWise.Views;

public partial class OpeningHours : ContentPage
{
    // Az étterem koordinátái (Deák tér példa)
    double restaurantLat = 47.4979;
    double restaurantLon = 19.0503;

    public OpeningHours()
    {
        InitializeComponent();
    }

    private async void OnOpenMapClicked(object sender, EventArgs e)
    {
        double lat = 47.4979;
        double lon = 19.0503;
        string restaurantName = "TableWise Restaurant";

        var location = new Location(lat, lon);
        var options = new MapLaunchOptions { Name = restaurantName };

        try
        {
            // 1. Kényszerítjük a főszálat a megnyitáshoz
            await MainThread.InvokeOnMainThreadAsync(async () =>
            {
                await Microsoft.Maui.ApplicationModel.Map.Default.OpenAsync(location, options);
            });
        }
        catch (Exception ex)
        {
            // Most már az ex-et is használjuk, hogy lássuk a hibát a kimeneten!
            await DisplayAlert("Error", "Could not load map.", "OK");
        }
    }

    private async void OnGetLocationClicked(object sender, EventArgs e)
    {
        try
        {
            // 1. Jogosultság kérése
            var status = await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
            if (status != PermissionStatus.Granted)
            {
                await DisplayAlert("Error", "Please enable location access in your settings to measure distance.", "OK");
                return;
            }

            // 2. Először megpróbáljuk a legutolsó ismert pozíciót lekérni (ez azonnali!)
            Location location = await Geolocation.Default.GetLastKnownLocationAsync();

            // 3. Ha nincs elmentett pozíció, vagy frissebbet akarunk, kérünk egy újat
            if (location == null)
            {
                location = await Geolocation.Default.GetLocationAsync(new GeolocationRequest
                {
                    DesiredAccuracy = GeolocationAccuracy.Medium,
                    Timeout = TimeSpan.FromSeconds(10) // 3-ról felemeltem 10-re a biztonság kedvéért
                });
            }

            if (location != null)
            {
                MainThread.BeginInvokeOnMainThread(() => {
                    LocationLabel.Text = $"Lat: {Math.Round(location.Latitude, 3)}, Lon: {Math.Round(location.Longitude, 3)}";

                    Location restaurantLoc = new Location(restaurantLat, restaurantLon);
                    double distance = location.CalculateDistance(restaurantLoc, DistanceUnits.Kilometers);

                    DistanceLabel.Text = $"{Math.Round(distance, 2)} km away from you";
                });
            }
            else
            {
                await DisplayAlert("GPS error", "Could not get your position. Try again!", "OK");
            }
        }
        catch (Exception ex)
        {
            // System.Diagnostics.Debug.WriteLine($"❌ GPS hiba: {ex.Message}");
            await DisplayAlert("Error", "Check your GPW settings and your network!", "OK");
        }
    }
}