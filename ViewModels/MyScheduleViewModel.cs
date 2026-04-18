using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using System.Diagnostics;
using TableWise.Models;
using TableWise.Services;

namespace TableWise.ViewModels
{
    public partial class MyScheduleViewModel : ObservableObject
    {
        // Kézi IsBusy implementáció, mert a generált néha hibát dob
        private bool _isBusy;
        public bool IsBusy
        {
            get => _isBusy;
            set
            {
                if (SetProperty(ref _isBusy, value))
                {
                    OnPropertyChanged(nameof(IsBusy));
                    OnPropertyChanged(nameof(IsListEmpty));
                }
            }
        }

        public bool IsListEmpty => MySchedules.Count == 0 && !IsBusy;

        public ObservableCollection<WorkHour> MySchedules { get; } = new ObservableCollection<WorkHour>();

        public MyScheduleViewModel()
        {
            // Kezdő adatok betöltése
           // _ = LoadSchedules();
        }

        [RelayCommand]
        public async Task LoadSchedules()
        {
            // Megakadályozzuk a dupla futást
            if (IsBusy) return;
            IsBusy = true;

            IsBusy = true;


            try
            {
                var hours = await DataService.GetUpcomingSchedulesAsync();

                var today = DateTime.Today;

                var filteredHours = hours
                        .Where(h => h.Details != null && h.Details.StartDate.Date >= today)
                        .OrderBy(h => h.Details.StartDate)
                        .ToList();

                // UI szálon frissítjük a listát
                await MainThread.InvokeOnMainThreadAsync(() =>
                {
                    MySchedules.Clear();
                    foreach (var hour in filteredHours) // A szűrt listát adjuk hozzá
                    {
                        MySchedules.Add(hour);
                    }

                });
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"❌ Error in loading: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}