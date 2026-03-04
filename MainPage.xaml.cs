using TableWise.Models;
using TableWise.Views;

namespace TableWise
{
    public partial class MainPage : ContentPage
    {
        public List<Category> Categories { get; set; }

        public List<FoodItem> Pizzas { get; set; }
        public List<FoodItem> Burgers { get; set; }
        public List<FoodItem> Drinks { get; set; }
        public List<FoodItem> Desserts { get; set; }
        public List<FoodItem> Salads { get; set; }


        public MainPage()
        {
            InitializeComponent();

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
                new FoodItem { Name = "Sajtburger", Description = "Paradicsomszósz, sonka, mozzarella", Price = 1900, Image = "cheese_burger.jpg" },
                new FoodItem { Name = "Margherita", Description = "Paradicsomszósz, mozzarella, bazsalikom", Price = 2500, Image = "cheese_burger.jpg" },
                new FoodItem { Name = "Prosciutto", Description = "Sonka, gomba, sajt", Price = 2800, Image = "cheese_burger.jpg" },
                new FoodItem { Name = "Quattro Formaggi", Description = "Négyféle sajt", Price = 3100, Image = "cheese_burger.jpg" },
                new FoodItem { Name = "Séf Kedvence", Description = "Meglepetés", Price = 3100, Image = "cheese_burger.jpg" }

            };
            Drinks = new List<FoodItem>
            {
                new FoodItem { Name = "Citromos Limonádé", Description = "citromos limo jéggel", Price = 1200, Image = "limonade.jpg" },
                new FoodItem { Name = "Epres Limonádé", Description = "epres limo jéggel", Price = 1200, Image = "limonade.jpg" },
                new FoodItem { Name = "Dinnyés Limonádé", Description = "dinnyés limo jéggel", Price = 1200, Image = "limonade.jpg" },
                new FoodItem { Name = "Áfonyás Limonádé Formaggi", Description = "áfonyás limo jéggel", Price = 1200, Image = "limonade.jpg" }

            };
            Desserts = new List<FoodItem>
            {
                new FoodItem { Name = "Csoki Torta", Description = "citromos limo jéggel", Price = 1200, Image = "chocolate_cake.jpg" },
                new FoodItem { Name = "Epres Limonádé", Description = "epres limo jéggel", Price = 1200, Image = "chocolate_cake.jpg" },
                new FoodItem { Name = "Dinnyés Limonádé", Description = "dinnyés limo jéggel", Price = 1200, Image = "chocolate_cake.jpg" }

            };
            Salads = new List<FoodItem>
            {
                new FoodItem { Name = "Csirkés Saláta", Description = "citromos limo jéggel", Price = 1200, Image = "chicken_salad.jpg" },
                new FoodItem { Name = "Epres Limonádé", Description = "epres limo jéggel", Price = 1200, Image = "chicken_salad.jpg" },
                new FoodItem { Name = "Dinnyés Limonádé", Description = "dinnyés limo jéggel", Price = 1200, Image = "chicken_salad.jpg" },
                new FoodItem { Name = "Áfonyás Limonádé Formaggi", Description = "áfonyás limo jéggel", Price = 1200, Image = "chicken_salad.jpg" },

            };

            BindingContext = this;

            StartCarouselTimer();
        }

        private void StartCarouselTimer()
        {
            // időzítő
            var timer = Dispatcher.CreateTimer();


            timer.Interval = TimeSpan.FromSeconds(6);


            timer.Tick += (s, e) =>
            {
                MainThread.BeginInvokeOnMainThread(() =>
                {
                    if (PromocioCarousel != null)
                    {
                        int nextPosition = (PromocioCarousel.Position + 1) % 3;
                        PromocioCarousel.Position = nextPosition;
                    }
                });
            };


            timer.Start();


        }

        // Ez a 'Vissza a tetejére' gomb eseménye
        private async void OnScrollToTopClicked(object sender, EventArgs e)
        {
            await MainScrollView.ScrollToAsync(0, 0, true);
        }

        // Ezt a metódust hívd meg, amikor egy kategóriára kattintanak
        // A CollectionView-nál add hozzá: SelectionChanged="OnCategorySelected"
        private async void OnCategorySelected(object sender, SelectionChangedEventArgs e)
        {
            if (e.CurrentSelection.FirstOrDefault() is Category selectedCategory)
            {
                Element targetElement = null;

                //  szekció ugrás
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

                // Kijelölés törlése, hogy újra rányomható legyen
                ((CollectionView)sender).SelectedItem = null;
            }
        }

        private async void OnFoodItemTapped(object sender, EventArgs e)
        {
            var border = (Border)sender;
            var tappedFood = (FoodItem)border.BindingContext;

            if (tappedFood != null)
            {
                // Átlépünk az új oldalra és átadjuk a kiválasztott ételt
                await Navigation.PushAsync(new FoodDetailPage(tappedFood));
            }
        }




    }
}