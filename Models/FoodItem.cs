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
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("ingridientId")]
        public int ingridientId { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("image")]
        public string Image { get; set; }


        [JsonIgnore] // Ez fontos, hogy ne akarja visszaküldeni a szervernek!
        public string FullImageUrl => $"https://table-wise-backend-for-render-hosting-1.onrender.com/images/{Image}";

        [JsonPropertyName("price")]
        public int Price { get; set; }

        [JsonPropertyName("categoryId")]
        public int CategoryId { get; set; }

        [JsonPropertyName("isAvailable")]
        public bool IsAvailable { get; set; }
    }
}