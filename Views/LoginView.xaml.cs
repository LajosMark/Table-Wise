using TableWise.ViewModels;

namespace TableWise.Views;

public partial class LoginView : ContentPage
{
	public LoginView(LoginViewModel vm)
	{
		InitializeComponent();
		BindingContext = vm;
	}
}