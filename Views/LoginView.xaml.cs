using TableWise.ViewModels;

namespace TableWise.Views;

public partial class LoginView : ContentPage
{
    public LoginView()
    {
        InitializeComponent();

        BindingContext = new LoginViewModel();
    }
}