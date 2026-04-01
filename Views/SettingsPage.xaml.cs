namespace TableWise.Views;

public partial class SettingsPage : ContentPage
{
	public SettingsPage()
	{
		InitializeComponent();

        ThemeSwitch.IsToggled = Application.Current?.RequestedTheme == AppTheme.Dark;
    }

    private void OnThemeToggled(object sender, ToggledEventArgs e)
    {
        if (Application.Current == null) return;

        Application.Current.UserAppTheme = e.Value ? AppTheme.Dark : AppTheme.Light;
    }
}