using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableWise.Models
{
    public class InventoryItem
    {
        // Figyelj a kisbetűkre, mert a JSON-ben is így van!
        [System.Text.Json.Serialization.JsonPropertyName("_id")]
        public int _id { get; set; }

        public string id => _id.ToString();
        public string name { get; set; }
        public double amount { get; set; }
        public double minAmount { get; set; }
        public string typeOfAmount { get; set; }

        // --- DINAMIKUS TULAJDONSÁGOK ---

        // A ProgressBar 0.0 és 1.0 közötti értéket vár.
        // Ha az aktuális mennyiség (amount) eléri a minimum kétszeresét,
        // telinek vesszük (1.0).

        public double Progress => (amount > 0) ? Math.Min(amount / 20.0, 1.0) : 0;
        // majd a lenti progress kell ideiglenesen a fentit használom

        //public double Progress
        //{
        //    get
        //    {
        //        if (minAmount <= 0) return 1.0; // Ha nincs limit, legyen teli a csík

        //        double ratio = amount / (minAmount * 2);
        //        return Math.Clamp(ratio, 0.0, 1.0); // Biztosítjuk, hogy 0 és 1 közé essen
        //    }
        //}

        // Színkezelés: Piros, ha a limit alatt vagyunk, különben zöldes
        public Color StatusColor => amount <= minAmount ? Colors.Red : Color.FromArgb("#69A481");

        // Figyelmeztető szöveg láthatósága
        public bool ShowWarning => amount <= minAmount;
    }
}