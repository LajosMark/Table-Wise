using Microsoft.Maui.Devices.Sensors;

namespace TableWise.Views;

public partial class OpeningHours : ContentPage
{
    // Az étterem koordinátái (Deák tér 1.)
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

            await MainThread.InvokeOnMainThreadAsync(async () =>
            {
                await Microsoft.Maui.ApplicationModel.Map.Default.OpenAsync(location, options);
            });
        }
        catch (Exception ex)
        {

            await DisplayAlert("Error", "Could not load map.", "OK");
        }
    }

    private async void OnGetLocationClicked(object sender, EventArgs e)
    {
        try
        {

            var status = await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
            if (status != PermissionStatus.Granted)
            {
                await DisplayAlert("Error", "Please enable location access!", "OK");
                return;
            }


            var request = new GeolocationRequest(GeolocationAccuracy.Medium, TimeSpan.FromSeconds(10));
            Location location = await Geolocation.Default.GetLocationAsync(request);

            if (location != null)
            {

                Location restaurantLoc = new Location(restaurantLat, restaurantLon);
                double distance = location.CalculateDistance(restaurantLoc, DistanceUnits.Kilometers);

                MainThread.BeginInvokeOnMainThread(() => {
                    LocationLabel.Text = $"Lat: {Math.Round(location.Latitude, 3)}, Lon: {Math.Round(location.Longitude, 3)}";
                    DistanceLabel.Text = $"{Math.Round(distance, 2)} km away from you";
                });
            }
        }
        catch (Exception ex)
        {
            await DisplayAlert("Error", "Check your GPS settings!", "OK");
        }
    }
}