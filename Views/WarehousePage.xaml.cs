namespace TableWise.Views;

using System.Collections.ObjectModel;
using TableWise.Models;

public partial class WarehousePage : ContentPage
{
    public ObservableCollection<InventoryItem> Stock { get; set; }
    public WarehousePage()
    {
        InitializeComponent();

        // MOCK DATA
        Stock = new ObservableCollection<InventoryItem>
        {
            new InventoryItem { Name = "Paradicsom", CurrentAmount = 25, MaxAmount = 100, Unit = "db" },
            new InventoryItem { Name = "Paprika", CurrentAmount = 40, MaxAmount = 100, Unit = "db" },
            new InventoryItem { Name = "Vöröshagyma", CurrentAmount = 12, MaxAmount = 100, Unit = "db" }, // Ez piros lesz! (12%)
            new InventoryItem { Name = "Lila hagyma", CurrentAmount = 14, MaxAmount = 100, Unit = "db" }, // Ez is piros! (14%)
            new InventoryItem { Name = "Sajt", CurrentAmount = 3, MaxAmount = 50, Unit = "kg" },          // Ez piros! (6%)
            new InventoryItem { Name = "Liszt", CurrentAmount = 45, MaxAmount = 50, Unit = "kg" }        // Ez zöld lesz.
        };

        InventoryList.ItemsSource = Stock;
    }

    private async void OnRestockClicked(object sender, EventArgs e)
    {
        // 1. Megkérdezzük a felhasználót (biztonsági mentés)
        bool answer = await DisplayAlert("Rendelés 🚚", "Biztosan feltöltöd a készletet?", "Igen", "Mégse");

        if (answer)
        {

            // 3. Végigmegyünk a listán és maxra toljuk a csíkokat
            foreach (var item in Stock)
            {
                item.CurrentAmount = item.MaxAmount;
            }

            // 4. Frissítjük a UI-t (mivel az ObservableCollection nem veszi észre a belső változást, 
            // egy gyors "trükkel" újrakötjük a forrást)
            InventoryList.ItemsSource = null;
            InventoryList.ItemsSource = Stock;

            await DisplayAlert("Siker!", "A raktár megtelt", "OK");
        }
    }
}