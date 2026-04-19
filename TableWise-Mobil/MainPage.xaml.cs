using CommunityToolkit.Mvvm.Messaging;
using System.Collections.ObjectModel;
using TableWise.Models;
using TableWise.Views;
using TableWise.Services;

namespace TableWise
{

    public class AppSleepMessage { }
    public class AppResumeMessage { }



    public partial class MainPage : ContentPage
    {

        private IDispatcherTimer _carouselTimer;

        public ObservableCollection<Category> Categories { get; set; } = new ObservableCollection<Category>();
        public ObservableCollection<CategoryGroup> FoodGroups { get; set; } = new ObservableCollection<CategoryGroup>();

        public MainPage()
        {
            InitializeComponent();




            BindingContext = this;


            WeakReferenceMessenger.Default.Register<AppSleepMessage>(this, (r, m) =>
            {
                StopTimer();
            });

            WeakReferenceMessenger.Default.Register<AppResumeMessage>(this, (r, m) =>
            {
                StartCarouselTimer();
            });

            StartCarouselTimer();
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

                if (meals != null && meals.Any())
                {
                    
                    var limitedMeals = meals.Take(3).ToList();

                    newGroups.Add(new CategoryGroup(cat.Name, limitedMeals));
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
                await DisplayAlert("Error", $"Exepction: {ex.Message}", "OK");
            }
        }

        private void StartCarouselTimer()
        {
            
            StopTimer();

            _carouselTimer = Dispatcher.CreateTimer();
            _carouselTimer.Interval = TimeSpan.FromSeconds(6);
            _carouselTimer.Tick += (s, e) =>
            {
                
                MainThread.BeginInvokeOnMainThread(() =>
                {
                    if (PromocioCarousel != null)
                    {
                        try
                        {
                            
                            int nextPosition = (PromocioCarousel.Position + 1) % 3;
                            PromocioCarousel.Position = nextPosition;
                        }
                        catch (Exception ex)
                        {
                            System.Diagnostics.Debug.WriteLine($"Carousel error: {ex.Message}");
                        }
                    }
                });
            };
            _carouselTimer.Start();
        }

        private void StopTimer()
        {
            if (_carouselTimer != null)
            {
                _carouselTimer.Stop();
                _carouselTimer = null;
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
}