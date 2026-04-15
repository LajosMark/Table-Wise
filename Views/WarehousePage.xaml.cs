namespace TableWise.Views;

using System.Collections.ObjectModel;
using TableWise.Models;
using TableWise.Services;

public partial class WarehousePage : ContentPage
{
    public ObservableCollection<InventoryItem> Stock { get; set; } = new();

    public WarehousePage()
    {
        InitializeComponent();
        BindingContext = this;
        InventoryList.ItemsSource = Stock;
    }

    // Minden alkalommal lefut, amikor az oldalra navigálunk
    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await LoadStockAsync();
    }

    private async Task LoadStockAsync()
    {
        // 1. Kérjük le az adatokat
        var items = await DataService.GetFridgeItemsAsync();

        Stock.Clear();

        // 3. Adjuk hozzá a szerverről jötteket
        foreach (var item in items)
        {
            Stock.Add(item);
        }
    }

    //private async void OnRestockClicked(object sender, EventArgs e)
    //{
    //    bool answer = await DisplayAlert("Rendelés 🚚", "Biztosan feltöltöd a készletet?", "Igen", "Mégse");
    //    if (answer)
    //    {
    //        // Itt majd egy PUT kérést kell küldeni a backendnek!
    //        await DisplayAlert("Siker!", "A rendelési igény elküldve a szervernek", "OK");
    //    }
    //}
}