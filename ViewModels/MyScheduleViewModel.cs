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
            Debug.WriteLine("🔄 [DEBUG] LoadSchedules elindult...");


            try
            {
                // 2. Csak akkor állítjuk kézzel true-ra, ha nem a RefreshView indította (pl. gombnyomás)
                // De a biztonság kedvéért kényszerítjük
                IsBusy = true;
                Debug.WriteLine($"✅ [DEBUG] IsBusy beállítva: {IsBusy}");

                var hours = await DataService.GetUpcomingSchedulesAsync();

                // Biztonsági ellenőrzés, ha null jönne vissza
                if (hours == null) hours = new List<WorkHour>();

                var today = DateTime.Today;
                var filteredHours = hours
                        .Where(h => h.Details != null && h.Details.StartDate.Date >= today)
                        .OrderBy(h => h.Details.StartDate)
                        .ToList();

                // 3. UI frissítése
                await MainThread.InvokeOnMainThreadAsync(() =>
                {
                    MySchedules.Clear();
                    foreach (var hour in filteredHours)
                    {
                        MySchedules.Add(hour);
                    }
                    Debug.WriteLine("📋 [DEBUG] Lista frissítve a UI-on.");
                });
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"❌ Error in loading: {ex.Message}");
            }
            finally
            {
                Debug.WriteLine("🏁 [DEBUG] Finally ág elérése...");
                // Adunk a UI-nak egy lélegzetvételnyi szünetet
                await Task.Delay(500);

                await MainThread.InvokeOnMainThreadAsync(() =>
                {
                    IsBusy = false;
                    OnPropertyChanged(nameof(IsBusy)); // Kézi kényszerítés
                    Debug.WriteLine($"🛑 [DEBUG] IsBusy leállítva: {IsBusy}");
                });
            }
        }
    }
}