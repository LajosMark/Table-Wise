using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableWise.Models;

public class InventoryItem
{
    public string id { get; set; }
    public string name { get; set; }
    public double amount { get; set; } // Aktuális mennyiség
    public string typeOfAmount { get; set; } // Mértékegység (kg, db)
    public double warningAmountPercentage { get; set; } // Mikor jelezzen
    public double pricePerUnit { get; set; }

    // Számolt tulajdonságok a UI-hoz
    public double Progress => amount / 100; // Feltételezve, hogy 100 a max, vagy a backendről jön a max
    public Color StatusColor => (amount <= warningAmountPercentage) ? Colors.Red : Colors.Green;
    public bool ShowWarning => amount <= warningAmountPercentage;
}