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
        var items = await DataService.GetFridgeItemsAsync();
        Stock.Clear();
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