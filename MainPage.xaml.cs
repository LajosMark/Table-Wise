using TableWise.Models;
using TableWise.Views;
using CommunityToolkit.Mvvm.Messaging;

namespace TableWise
{
    // Üzenet osztályok a kommunikációhoz
    public class AppSleepMessage { }
    public class AppResumeMessage { }

    public partial class MainPage : ContentPage
    {
        // 1. Osztály szintű változó a biztonságos eléréshez
        private IDispatcherTimer _carouselTimer;

        public List<Category> Categories { get; set; }
        public List<FoodItem> Pizzas { get; set; }
        public List<FoodItem> Burgers { get; set; }
        public List<FoodItem> Drinks { get; set; }
        public List<FoodItem> Desserts { get; set; }
        public List<FoodItem> Salads { get; set; }

        public MainPage()
        {
            InitializeComponent();

            // Adatok betöltése
            LoadMockData();

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

        private void LoadMockData()
        {
            Categories = new List<Category>
            {
                new Category { Name = "Pizzák", Icon = "ham_pizza.jpg" },
                new Category { Name = "Burgerek", Icon = "cheese_burger.jpg" },
                new Category { Name = "Italok", Icon = "limonade.jpg" },
                new Category { Name = "Desszertek", Icon = "chocolate_cake.jpg" },
                new Category { Name = "Saláták", Icon = "chicken_salad.jpg" }
            };

            Pizzas = new List<FoodItem>
            {
                new FoodItem { Name = "HamHam", Description = "Paradicsomszósz, sonka, mozzarella", Price = 1900, Image = "ham_pizza.jpg" },
                new FoodItem { Name = "Margherita", Description = "Paradicsomszósz, mozzarella, bazsalikom", Price = 2500, Image = "ham_pizza.jpg" },
                new FoodItem { Name = "Prosciutto", Description = "Sonka, gomba, sajt", Price = 2800, Image = "ham_pizza.jpg" },
                new FoodItem { Name = "Quattro Formaggi", Description = "Négyféle sajt", Price = 3100, Image = "ham_pizza.jpg" },
                new FoodItem { Name = "Séf Kedvence", Description = "Meglepetés", Price = 3100, Image = "ham_pizza.jpg" }
            };

            Burgers = new List<FoodItem>
            {
                new FoodItem { Name = "Sajtburger", Description = "Marhahús, sajt, hagyma", Price = 1900, Image = "cheese_burger.jpg" },
                new FoodItem { Name = "BBQ Burger", Description = "BBQ szósz, bacon", Price = 2500, Image = "cheese_burger.jpg" }
            };

            Drinks = new List<FoodItem>
            {
                new FoodItem { Name = "Limonádé", Description = "Friss citrommal", Price = 1200, Image = "limonade.jpg" }
            };

            Desserts = new List<FoodItem>
            {
                new FoodItem { Name = "Csoki Torta", Description = "Belga csokival", Price = 1200, Image = "chocolate_cake.jpg" }
            };

            Salads = new List<FoodItem>
            {
                new FoodItem { Name = "Csirkés Saláta", Description = "Friss zöldségekkel", Price = 1200, Image = "chicken_salad.jpg" }
            };
        }

        private async void OnScrollToTopClicked(object sender, EventArgs e)
        {
            await MainScrollView.ScrollToAsync(0, 0, true);
        }

        private async void OnCategorySelected(object sender, SelectionChangedEventArgs e)
        {
            if (e.CurrentSelection.FirstOrDefault() is Category selectedCategory)
            {
                Element targetElement = null;
                switch (selectedCategory.Name)
                {
                    case "Pizzák": targetElement = PizzaSection; break;
                    case "Burgerek": targetElement = BurgerSection; break;
                    case "Italok": targetElement = DrinkSection; break;
                    case "Desszertek": targetElement = DessertSection; break;
                    case "Saláták": targetElement = SaladSection; break;
                }

                if (targetElement != null)
                {
                    await MainScrollView.ScrollToAsync(targetElement, ScrollToPosition.Start, true);
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