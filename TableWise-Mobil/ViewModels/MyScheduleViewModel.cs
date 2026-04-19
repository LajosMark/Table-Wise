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
        // Kézi IsBusy implementáció, mert a generált midig hibát dob :/
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
            // Kezdő adatok betöltése (még kellhet)
           // _ = LoadSchedules();
        }

        [RelayCommand]
        public async Task LoadSchedules()
        {
            


            try
            {

                IsBusy = true;


                var hours = await DataService.GetUpcomingSchedulesAsync();

                // Biztonsági ellenőrzés
                if (hours == null) hours = new List<WorkHour>();

                var today = DateTime.Today;
                var filteredHours = hours
                        .Where(h => h.Details != null && h.Details.StartDate.Date >= today)
                        .OrderBy(h => h.Details.StartDate)
                        .ToList();


                await MainThread.InvokeOnMainThreadAsync(() =>
                {
                    MySchedules.Clear();
                    foreach (var hour in filteredHours)
                    {
                        MySchedules.Add(hour);
                    }

                });
            }
            catch (Exception ex)
            {
                Debug.WriteLine($" Error in loading: {ex.Message}");
            }
            finally
            {

                await Task.Delay(500);

                await MainThread.InvokeOnMainThreadAsync(() =>
                {
                    IsBusy = false;
                    OnPropertyChanged(nameof(IsBusy));
                });
            }
        }
    }
}