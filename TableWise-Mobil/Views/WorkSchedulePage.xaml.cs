using TableWise.ViewModels;
using TableWise.Services;

namespace TableWise.Views;

public partial class WorkSchedulePage : ContentPage
{
	public WorkSchedulePage()
	{
		InitializeComponent();
		BindingContext = new WorkScheduleViewModel();
	}


}