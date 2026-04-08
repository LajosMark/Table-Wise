using System.Collections.ObjectModel;
using TableWise.Models;
using TableWise.Services;
using TableWise.Views;
namespace TableWise.Views;

public partial class MenuPage : ContentPage
{
    public ObservableCollection<Category> Categories { get; set; } = new ObservableCollection<Category>();
    public ObservableCollection<CategoryGroup> FoodGroups { get; set; } = new ObservableCollection<CategoryGroup>();

    public MenuPage()
	{
		InitializeComponent();


        BindingContext = this;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await RefreshCategoriesFromApi();
    }

    private async Task RefreshCategoriesFromApi()
    {
        if (Categories.Count > 0) return;

        try
        {
            var liveCategories = await DataService.GetCategories();

            if (liveCategories != null)
            {
                // 1. Elõször ürítünk mindent a fõszálon
                MainThread.BeginInvokeOnMainThread(() => {
                    Categories.Clear();
                    FoodGroups.Clear();
                });
                foreach (var cat in liveCategories)
                {
                    var meals = await DataService.GetMealsByCategory(cat.Id);

                    MainThread.BeginInvokeOnMainThread(() => {
                        Categories.Add(cat);
                        if (meals != null && meals.Count > 0)
                        {
                            FoodGroups.Add(new CategoryGroup(cat.Name, meals));
                        }
                    });
                }
            }
        }
        catch (Exception ex)
        {
            await DisplayAlert("Hiba", $"Kivétel történt: {ex.Message}", "OK");
        }
    }

    private void OnScrollToTopClicked(object sender, EventArgs e)
    {
        // Csak ha az elõzõ nem válna be:
        var firstItem = FoodGroups.FirstOrDefault()?.FirstOrDefault();
        if (firstItem != null)
        {
            FoodCollectionView.ScrollTo(firstItem, position: ScrollToPosition.Start, animate: true);
        }
    }

    private async void OnCategorySelected(object sender, SelectionChangedEventArgs e)
    {
        if (e.CurrentSelection.FirstOrDefault() is Category selectedCategory)
        {
            // Megkeressük a csoportot, aminek a neve megegyezik a választott kategóriával
            var targetGroup = FoodGroups.FirstOrDefault(g => g.Name == selectedCategory.Name);

            if (targetGroup != null)
            {
                // A CollectionView magától oda tud görgetni a csoporthoz!
                // Itt a 'FoodCollectionView' a CollectionView x:Name-je legyen!
                FoodCollectionView.ScrollTo(targetGroup, position: ScrollToPosition.Start, animate: true);
            }

            ((CollectionView)sender).SelectedItem = null;
        }
    }

    private async void OnFoodItemTapped(object sender, EventArgs e)
    {
        var border = (Border)sender;
        if (border.BindingContext is FoodItem tappedFood)
        {
            await Navigation.PushAsync(new FoodDetailPage(tappedFood));
        }
    }




}