using System.Diagnostics;
using System.Net.NetworkInformation;
using TableWise.Models;

namespace TableWise.Views;

public partial class FoodDetailPage : ContentPage
{
    private Models.FoodItem _item;

    public FoodDetailPage(Models.FoodItem item)
    {
        InitializeComponent();
        _item = item;
        BindingContext = _item;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        // 1. Lekérés
        var list = await Services.DataService.GetMealIngredientsAsync(_item.Id);

        // 2. Debug: Látjuk a konzolon, ha megjött?
        System.Diagnostics.Debug.WriteLine($"---> UI frissítés indul. Lista elemek: {list?.Count ?? 0}");

        MainThread.BeginInvokeOnMainThread(() => {
            IngredientsList.Children.Clear();

            if (list != null && list.Count > 0)
            {
                foreach (var ing in list)
                {
                    // Manuális label létrehozás
                    var label = new Label
                    {
                        Text = $"• {ing}",
                        FontSize = 18,
                        TextColor = Colors.White, // Fix fehér, a piros háttéren látszódnia KELL
                        Margin = new Thickness(5)
                    };

                    IngredientsList.Children.Add(label);
                    System.Diagnostics.Debug.WriteLine($"---> Label hozzáadva: {ing}");
                }
            }
            else
            {
                IngredientsList.Children.Add(new Label { Text = "Nincs alapanyag...", TextColor = Colors.Yellow });
            }
        });
    }
}