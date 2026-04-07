using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Text.Json.Serialization;

namespace TableWise.Models
{
    public class FoodItem
    {
        [JsonPropertyName("_id")]
        public int Id { get; set; } // Az adatbázisban 6-os, de lehet string is a MongoDB miatt

        [JsonPropertyName("name")]
        public string Name { get; set; }

        // Mivel a DB-ben nincs 'Description', használjuk az 'ingridientId'-t ideiglenesen, 
        // vagy hagyd üresen, de a JSON-ben nem létezik 'Description' kulcs!
        [JsonPropertyName("ingridientId")]
        public int ingridientId { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("image")]
        public string Image { get; set; }

        [JsonPropertyName("price")]
        public int Price { get; set; }

        [JsonPropertyName("categoryId")]
        public int CategoryId { get; set; }

        [JsonPropertyName("isAvailable")]
        public bool IsAvailable { get; set; }
    }
}