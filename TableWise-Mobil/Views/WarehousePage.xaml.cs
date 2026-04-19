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


}