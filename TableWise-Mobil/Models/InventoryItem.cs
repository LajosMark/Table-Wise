using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableWise.Models
{
    public class InventoryItem
    {
        [System.Text.Json.Serialization.JsonPropertyName("_id")]
        public int _id { get; set; }

        public string id => _id.ToString();
        public string name { get; set; }
        public double amount { get; set; }
        public double minAmount { get; set; }
        public string typeOfAmount { get; set; }



        public double Progress => (amount > 0) ? Math.Min(amount / 20.0, 1.0) : 0;

        public Color StatusColor => amount <= minAmount ? Colors.Red : Color.FromArgb("#69A481");

        public bool ShowWarning => amount <= minAmount;
    }
}