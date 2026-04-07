using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Text.Json.Serialization;

namespace TableWise.Models
{
    public class Category
    {
        [JsonPropertyName("_id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        // Feltételezve, hogy az API-ban 'icon' vagy 'image' néven jön az ikon
        [JsonPropertyName("icon")]
        public string Image { get; set; }
    }
}
