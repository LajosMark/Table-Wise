using CommunityToolkit.Mvvm.Messaging;
using System.Collections.ObjectModel;
using TableWise.Models;
using TableWise.Views;
using TableWise.Services;

namespace TableWise
{
    // Üzenet osztályok a kommunikációhoz
    public class AppSleepMessage { }
    public class AppResumeMessage { }



    public partial class MainPage : ContentPage
    {
        // 1. Osztály szintű változó a biztonságos eléréshez
        private IDispatcherTimer _carouselTimer;

        public ObservableCollection<Category> Categories { get; set; } = new ObservableCollection<Category>();
        public ObservableCollection<CategoryGroup> FoodGroups { get; set; } = new ObservableCollection<CategoryGroup>();

        public MainPage()
        {
            InitializeComponent();




            BindingContext = this;

            // 2. Feliratkozás a modern WeakReferenceMessenger-rel
            // Ez megakadályozza a memóriaszivárgást és a háttérben történő fagyást
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

        // Ez a metódus fut le minden alkalommal, amikor az oldal megjelenik
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
                    // 1. Először ürítünk mindent a főszálon
                    MainThread.BeginInvokeOnMainThread(() => {
                        Categories.Clear();
                        FoodGroups.Clear();
                    });
                    foreach (var cat in liveCategories)
                    {
                        var meals = await DataService.GetMealsByCategory(cat.Id);

                        // EZZEL nézzük meg, jön-e tényleg adat:
                        await DisplayAlert("DEBUG", $"Kategória: {cat.Name}\nID: {cat.Id}\nÉtelek száma: {meals?.Count ?? 0}", "OK");

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

        private void StartCarouselTimer()
        {
            // Tisztítás indítás előtt
            StopTimer();

            _carouselTimer = Dispatcher.CreateTimer();
            _carouselTimer.Interval = TimeSpan.FromSeconds(6);
            _carouselTimer.Tick += (s, e) =>
            {
                // UI frissítés csak a főszálon
                MainThread.BeginInvokeOnMainThread(() =>
                {
                    if (PromocioCarousel != null)
                    {
                        try
                        {
                            // A Carousel léptetése (feltételezve, hogy 3 elem van benne)
                            int nextPosition = (PromocioCarousel.Position + 1) % 3;
                            PromocioCarousel.Position = nextPosition;
                        }
                        catch (Exception ex)
                        {
                            System.Diagnostics.Debug.WriteLine($"Carousel hiba: {ex.Message}");
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

        private async void OnScrollToTopClicked(object sender, EventArgs e)
        {
            FoodCollectionView.ScrollTo(0, position: ScrollToPosition.Start, animate: true);
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
}