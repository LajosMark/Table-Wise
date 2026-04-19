using TableWise.ViewModels;

namespace TableWise.Views;

public partial class RegisterView : ContentPage
{
    public RegisterView()
    {
        InitializeComponent();
        BindingContext = new RegisterViewModel();
    }
}