namespace TableWise
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
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
    }
}