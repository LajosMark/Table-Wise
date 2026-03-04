using TableWise.Models;

namespace TableWise.Views;

public partial class FoodDetailPage : ContentPage
{
	public FoodDetailPage(FoodItem selectedFood)
	{
		InitializeComponent();

		BindingContext = selectedFood;
	}
}