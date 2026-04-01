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
        // Az éttermed pontos koordinátái
        double lat = 47.4979;
        double lon = 19.0503;
        string restaurantName = "TableWise Étterem";

        // Létrehozzuk a helyszín objektumot
        var location = new Location(lat, lon);

        // Beállítjuk, hogy mi jelenjen meg címkeként a térképen
        var options = new MapLaunchOptions { Name = restaurantName };

        try
        {
            // Ez a bûvös sor nyitja meg a gyári térkép appot
            await Microsoft.Maui.ApplicationModel.Map.Default.OpenAsync(location, options);
        }
        catch (Exception ex)
        {
            await DisplayAlert("Hiba", "Nem található térképalkalmazás a készüléken.", "OK");
        }
    }

    private async void OnGetLocationClicked(object sender, EventArgs e)
    {
        try
        {
            var status = await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
            if (status != PermissionStatus.Granted) return;

            var location = await Geolocation.Default.GetLocationAsync(new GeolocationRequest
            {
                DesiredAccuracy = GeolocationAccuracy.Medium,
                Timeout = TimeSpan.FromSeconds(5)
            });

            if (location != null)
            {
                LocationLabel.Text = $"Lat: {Math.Round(location.Latitude, 3)}, Lon: {Math.Round(location.Longitude, 3)}";

                Location restaurantLoc = new Location(restaurantLat, restaurantLon);
                double distance = location.CalculateDistance(restaurantLoc, DistanceUnits.Kilometers);

                DistanceLabel.Text = $"{Math.Round(distance, 2)} km-re vagyunk tõled";
            }
        }
        catch (Exception ex)
        {
            await DisplayAlert("Hiba", "Nem sikerült a GPS lekérdezés.", "OK");
        }
    }
}