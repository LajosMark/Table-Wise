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


        await ReloadFoodGroups();
    }

    private async Task ReloadFoodGroups()
    {

        var categories = await DataService.GetCategories();
        var newGroups = new ObservableCollection<CategoryGroup>();

        foreach (var cat in categories)
        {

            var meals = await DataService.GetMealsByCategory(cat.Id);

            if (meals.Any())
            {
                newGroups.Add(new CategoryGroup(cat.Name, meals));
            }
        }

        
        FoodGroups = newGroups;


        OnPropertyChanged(nameof(FoodGroups));
    }

    private async Task RefreshCategoriesFromApi()
    {
        if (Categories.Count > 0) return;

        try
        {
            var liveCategories = await DataService.GetCategories();

            if (liveCategories != null)
            {

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
            await DisplayAlert("Error", $"exeption: {ex.Message}", "OK");
        }
    }

    private void OnScrollToTopClicked(object sender, EventArgs e)
    {

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

            var targetGroup = FoodGroups.FirstOrDefault(g => g.Name == selectedCategory.Name);

            if (targetGroup != null && targetGroup.Count > 0)
            {

                var firstItemInGroup = targetGroup[0];

                FoodCollectionView.ScrollTo(
                    item: firstItemInGroup,
                    group: targetGroup,
                    position: ScrollToPosition.Start,
                    animate: true);
            }
            else if (targetGroup != null)
            {
                
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