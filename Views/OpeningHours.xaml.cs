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
        string restaurantName = "TableWise Étterem";

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
            System.Diagnostics.Debug.WriteLine($"❌ Térkép hiba: {ex.Message}");
            await DisplayAlert("Hiba", "Nem sikerült megnyitni a térképet.", "OK");
        }
    }

    private async void OnGetLocationClicked(object sender, EventArgs e)
    {
        try
        {
            var status = await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
            if (status != PermissionStatus.Granted) return;

            // 2. Rövidebb timeout és Cancellation handling
            // Néha a GPS lekérdezés "beragad", miközben váltasz a Google Maps-re
            var location = await Geolocation.Default.GetLocationAsync(new GeolocationRequest
            {
                DesiredAccuracy = GeolocationAccuracy.Medium,
                Timeout = TimeSpan.FromSeconds(3) // 5-ről levettem 3-ra
            });

            if (location != null)
            {
                // UI frissítés szigorúan a főszálon
                MainThread.BeginInvokeOnMainThread(() => {
                    LocationLabel.Text = $"Lat: {Math.Round(location.Latitude, 3)}, Lon: {Math.Round(location.Longitude, 3)}";

                    Location restaurantLoc = new Location(restaurantLat, restaurantLon);
                    double distance = location.CalculateDistance(restaurantLoc, DistanceUnits.Kilometers);

                    DistanceLabel.Text = $"{Math.Round(distance, 2)} km-re vagyunk tőled";
                });
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"❌ GPS hiba: {ex.Message}");
            // Csak akkor dobunk Alert-et, ha tényleg hiba van, nem csak lemondtuk
            await DisplayAlert("Hiba", "Ellenőrizd a GPS beállításokat!", "OK");
        }
    }
}