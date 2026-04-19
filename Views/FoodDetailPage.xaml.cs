using Microsoft.Maui.Controls.Shapes;
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
        Debug.WriteLine($"---> [DEBUG] OnAppearing indítva: {_item.Name} (ID: {_item.Id})");

        try
        {
            var list = await Services.DataService.GetMealIngredientsAsync(_item.Id);

            if (list == null)
            {
                Debug.WriteLine("---> [DEBUG] A kapott lista NULL!");
            }
            else
            {
                Debug.WriteLine($"---> [DEBUG] API válasz megérkezett. Elemek száma: {list.Count}");
                foreach (var ing in list) Debug.WriteLine($"---> [DEBUG] Összetevő: {ing}");
            }

            MainThread.BeginInvokeOnMainThread(() => {
                Debug.WriteLine($"Lista feltöltése indul... Elemek száma: {list.Count}");
                _item.Ingredients.Clear();

                if (list != null && list.Count > 0)
                {
                    foreach (var ing in list) _item.Ingredients.Add(ing);
                }
                else
                {
                    _item.Ingredients.Add("🤫 Titkos recept");
                }

                // Kényszerített UI frissítés
                BindingContext = null;
                BindingContext = _item;
                Debug.WriteLine("---> [DEBUG] UI frissítés kész (BindingContext resetelve)");
            });
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"---> [DEBUG] CRASH AKADÁLYOZVA: {ex.Message}");
        }
    }
}