using System.Diagnostics;
using TableWise.ViewModels;

namespace TableWise.Views;

public partial class MySchedulePage : ContentPage
{
	public MySchedulePage()
	{
		InitializeComponent();

        BindingContext = new MyScheduleViewModel();

    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        if (BindingContext is MyScheduleViewModel vm)
        {
            await vm.LoadSchedules();
        }
    }
}