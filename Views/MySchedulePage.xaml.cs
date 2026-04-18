using System.Diagnostics;
using TableWise.ViewModels;

namespace TableWise.Views;

public partial class MySchedulePage : ContentPage
{
	public MySchedulePage()
	{
		InitializeComponent();

        BindingContext = new TableWise.ViewModels.MyScheduleViewModel();

        MessagingCenter.Subscribe<MyScheduleViewModel>(this, "RefreshFinished", (sender) =>
        {
            MainThread.BeginInvokeOnMainThread(async () =>
            {
                await Task.Delay(300); // 👈 Ennyi idő kell a UI-nak, hogy "megnyugodjon"
                if (MyRefreshView != null)
                {
                    MyRefreshView.IsRefreshing = false; // 👈 Itt kényszerítjük le

                }
            });
        });
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        if (BindingContext is TableWise.ViewModels.MyScheduleViewModel vm)
        {
            await vm.LoadSchedules();
        }
    }
}