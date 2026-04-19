using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using TableWise.Services;

namespace TableWise.ViewModels
{
    public partial class WorkScheduleViewModel : ObservableObject
    {
        // --- PRIVÁT VÁLTOZÓK ---
        private bool _isWeekView = true;
        private bool _isDayView = false;
        private bool _isTimeView = false;
        private string _selectedWeekText;
        private DateTime _selectedDate = DateTime.Now;
        private double _startHour = 8;
        private double _endHour = 16;

        // --- PUBLIKUS TULAJDONSÁGOK (A XAML ezekhez kötődik) ---
        public bool IsWeekView
        {
            get => _isWeekView;
            set => SetProperty(ref _isWeekView, value);
        }

        public bool IsDayView
        {
            get => _isDayView;
            set => SetProperty(ref _isDayView, value);
        }

        public bool IsTimeView
        {
            get => _isTimeView;
            set => SetProperty(ref _isTimeView, value);
        }

        public string SelectedWeekText
        {
            get => _selectedWeekText;
            set => SetProperty(ref _selectedWeekText, value);
        }

        public DateTime SelectedDate
        {
            get => _selectedDate;
            set => SetProperty(ref _selectedDate, value);
        }

        public double StartHour
        {
            get => _startHour;
            set
            {
                if (SetProperty(ref _startHour, value))
                {
                    OnPropertyChanged(nameof(TimeRangeText));
                }
            }
        }

        public double EndHour
        {
            get => _endHour;
            set
            {
                if (SetProperty(ref _endHour, value))
                {
                    OnPropertyChanged(nameof(TimeRangeText));
                }
            }
        }

        // Listák és számolt mezők
        public ObservableCollection<string> Weeks { get; } = new ObservableCollection<string>();
        public ObservableCollection<DateTime> Days { get; } = new ObservableCollection<DateTime>();
        public string TimeRangeText => $"{Math.Floor(StartHour)}:00 - {Math.Floor(EndHour)}:00";

        // --- KONSTRUKTOR ---
        public WorkScheduleViewModel()
        {
            Weeks.Clear();
            Weeks.Add("This week");
            Weeks.Add("Next week");
            Weeks.Add("In two weeks");
        }

        // --- PARANCSOK ---

        [RelayCommand]
        private void SelectWeek(string week)
        {
            if (string.IsNullOrEmpty(week)) return;
            SelectedWeekText = week;
            Days.Clear();

            DateTime today = DateTime.Now;
            DateTime startDay;
            int daysToShow = 7;

            if (week == "This week")
            {
                startDay = today.AddDays(1);
                int currentDayNum = (int)today.DayOfWeek;
                if (currentDayNum == 0) currentDayNum = 7;
                daysToShow = 8 - currentDayNum;
            }
            else if (week == "Next week")
            {
                int daysUntilMonday = ((int)DayOfWeek.Monday - (int)today.DayOfWeek + 7) % 7;
                if (daysUntilMonday == 0) daysUntilMonday = 7;
                startDay = today.AddDays(daysUntilMonday);
            }
            else
            {
                int daysUntilMonday = ((int)DayOfWeek.Monday - (int)today.DayOfWeek + 7) % 7;
                if (daysUntilMonday == 0) daysUntilMonday = 7;
                startDay = today.AddDays(daysUntilMonday + 7);
            }

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

        [RelayCommand]
        private async Task Submit()
        {
            string checkId = Preferences.Get("user_id", string.Empty);
            if (string.IsNullOrEmpty(checkId))
            {
                await Application.Current.MainPage.DisplayAlert("Error", "User id not found. Please login again", "OK");
                return;
            }

            double duration = EndHour - StartHour;

            if (StartHour >= EndHour)
            {
                await Application.Current.MainPage.DisplayAlert("Validation Error", "The end time must be later than the start time!", "OK");
                return;
            }

            if (duration < 4)
            {
                await Application.Current.MainPage.DisplayAlert("Validation Error", "A shift must be at least 4 hours long!", "OK");
                return;
            }

            if (duration > 10)
            {
                await Application.Current.MainPage.DisplayAlert("Validation Error", "A shift cannot exceed 10 hours!", "OK");
                return;
            }

            // 2. Első lépés: Idősáv létrehozása
            var hourResult = await DataService.SubmitWorkScheduleAsync(SelectedDate, (int)Math.Floor(StartHour), (int)Math.Floor(EndHour));

            if (hourResult.Success)
            {
                // 3. Második lépés: Összekapcsolás a felhasználóval
                var linkResult = await DataService.LinkScheduleToUserAsync(hourResult.NewId);

                if (linkResult.Success)
                {
                    await Application.Current.MainPage.DisplayAlert("Success", "Shift created!", "OK");
                    BackToWeeks();
                }
                else
                {
                    await Application.Current.MainPage.DisplayAlert("Error", "Date created, but user link is not: " + linkResult.Message, "OK");
                }
            }
            else
            {
                await Application.Current.MainPage.DisplayAlert("Error", hourResult.Message, "OK");
            }
        }
    }
}