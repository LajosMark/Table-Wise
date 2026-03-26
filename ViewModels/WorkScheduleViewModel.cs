using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;

namespace TableWise.ViewModels
{
    public partial class WorkScheduleViewModel : ObservableObject
    {
        // 1. NÉZET VEZÉRLŐK
        [ObservableProperty] private bool isWeekView = true;
        [ObservableProperty] private bool isDayView = false;
        [ObservableProperty] private bool isTimeView = false;

        // 2. ADATOK
        [ObservableProperty] private string selectedWeekText;
        [ObservableProperty] private DateTime selectedDate = DateTime.Now;

        // 3. CSÚSZKÁK (Egyszerűen, hiba nélkül)
        [ObservableProperty]
        [NotifyPropertyChangedFor(nameof(TimeRangeText))]
        private double startHour = 8;

        [ObservableProperty]
        [NotifyPropertyChangedFor(nameof(TimeRangeText))]
        private double endHour = 16;

        // 4. LISTÁK (Ami hiányzott!)
        public ObservableCollection<string> Weeks { get; } = new ObservableCollection<string>();
        public ObservableCollection<DateTime> Days { get; } = new ObservableCollection<DateTime>();

        // 5. IDŐ KIÍRÁSA
        public string TimeRangeText => $"{Math.Floor(StartHour)}:00 - {Math.Floor(EndHour)}:00";

        // 6. KONSTRUKTOR (Feltöltjük a heteket rögtön)
        public WorkScheduleViewModel()
        {
            Weeks.Clear();
            Weeks.Add("Ezen a héten");
            Weeks.Add("Jövő héten");
            Weeks.Add("2 hét múlva");

            isWeekView = true;
        }

        // 7. PARANCSOK (Navigáció)
        [RelayCommand]
        private void SelectWeek(string week)
        {
            if (string.IsNullOrEmpty(week)) return;
            SelectedWeekText = week;
            Days.Clear();

            DateTime today = DateTime.Now;
            DateTime startDay;
            int daysToShow = 7; // Alapesetben egy teljes hét

            if (week == "Ezen a héten")
            {
                startDay = today.AddDays(1);
                // Kiszámoljuk, hány nap van hátra vasárnapig (DayOfWeek.Sunday = 0)
                int currentDayNum = (int)today.DayOfWeek;
                if (currentDayNum == 0) currentDayNum = 7; // Ha vasárnap van, legyen 7

                daysToShow = 8 - currentDayNum; // Pl. Csütörtök(4): 8-4 = 4 nap (Cs, P, Szo, V)
            }
            else if (week == "Jövő héten")
            {
                // Megkeressük a következő hétfőt
                int daysUntilMonday = ((int)DayOfWeek.Monday - (int)today.DayOfWeek + 7) % 7;
                if (daysUntilMonday == 0) daysUntilMonday = 7;
                startDay = today.AddDays(daysUntilMonday);
            }
            else // "2 hét múlva"
            {
                int daysUntilMonday = ((int)DayOfWeek.Monday - (int)today.DayOfWeek + 7) % 7;
                if (daysUntilMonday == 0) daysUntilMonday = 7;
                startDay = today.AddDays(daysUntilMonday + 7);
            }

            // Csak a meghatározott számú napot adjuk hozzá
            for (int i = 0; i < daysToShow; i++)
            {
                Days.Add(startDay.AddDays(i));
            }

            IsWeekView = false;
            IsDayView = true;
        }

        [RelayCommand]
        private void SelectDay(DateTime day)
        {
            SelectedDate = day;
            IsDayView = false;
            IsTimeView = true;
        }

        [RelayCommand]
        private void BackToWeeks() { IsWeekView = true; IsDayView = false; IsTimeView = false; }

        [RelayCommand]
        private void BackToDays() { IsDayView = true; IsTimeView = false; }

        // 8. BEKÜLDÉS (Itt ellenőrizzük a 10 órát, így nem romlik el a UI!)
        [RelayCommand]
        private async Task Submit()
        {
            double duration = EndHour - StartHour;
            if (StartHour >= EndHour)
            {
                await Application.Current.MainPage.DisplayAlert("Hiba", "A kezdés legyen előbb!", "OK");
                return;
            }
            if (duration > 10)
            {
                await Application.Current.MainPage.DisplayAlert("Hiba", "Max 10 órát dolgozhatsz!", "OK");
                return;
            }

            await Application.Current.MainPage.DisplayAlert("Siker", "Beosztás mentve!", "OK");
            BackToWeeks();
        }
    }
}