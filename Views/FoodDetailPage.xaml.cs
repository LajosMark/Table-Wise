using Microsoft.Maui.Controls.Shapes;
using System.Diagnostics;
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


        if (!Preferences.Default.ContainsKey("user_token"))
        {
            UpdateToSecretMode();
            return;
        }



        try
        {
            var list = await Services.DataService.GetMealIngredientsAsync(_item.Id);

            MainThread.BeginInvokeOnMainThread(() => {
                _item.Ingredients.Clear();


                if (list != null && list.Count > 0 && !list[0].Contains("Secret recipe"))
                {
                    foreach (var ing in list) _item.Ingredients.Add(ing);

                }
                else
                {
                    _item.Ingredients.Add("🤫 Secret recipe");
                }


                BindingContext = null;
                BindingContext = _item;
            });
        }
        catch (Exception ex)
        {
            //Debug.WriteLine($"---> [DEBUG] Error: {ex.Message}");
            UpdateToSecretMode();
        }
    }

    private void UpdateToSecretMode()
    {
        MainThread.BeginInvokeOnMainThread(() => {
            _item.Ingredients.Clear();
            _item.Ingredients.Add("🤫 Secret recipe");
            BindingContext = null;
            BindingContext = _item;
        });
    }
}