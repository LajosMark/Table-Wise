using CommunityToolkit.Mvvm.ComponentModel;
using System.Collections.ObjectModel;
using TableWise.Models;
using TableWise.Services;

namespace TableWise.ViewModels
{
    public partial class MyScheduleViewModel : ObservableObject
    {
        private bool _isBusy;
        public bool IsBusy
        {
            get => _isBusy;
            set => SetProperty(ref _isBusy, value);
        }

        public ObservableCollection<WorkHour> MySchedules { get; } = new ObservableCollection<WorkHour>();

        public MyScheduleViewModel()
        {
            // Oldal betöltésekor indítjuk a lekérést
            _ = LoadSchedulesAsync();
        }

        public async Task LoadSchedulesAsync()
        {
            if (IsBusy) return;
            IsBusy = true;

            try
            {
                var hours = await DataService.GetUpcomingSchedulesAsync();
                MySchedules.Clear();
                foreach (var hour in hours)
                {
                    MySchedules.Add(hour);
                }
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}