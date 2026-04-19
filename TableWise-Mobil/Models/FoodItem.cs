using System.Collections.ObjectModel;
using System.Text.Json.Serialization;

namespace TableWise.Models
{
    public class FoodItem
    {
        [JsonPropertyName("_id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("ingridientId")]
        public int ingridientId { get; set; }

        public ObservableCollection<string> Ingredients { get; set; } = new ObservableCollection<string>();

        [JsonPropertyName("image")]
        public string Image { get; set; }

        [JsonIgnore]
        public string FullImageUrl => $"https://table-wise-backend-for-render-hosting-1.onrender.com/images/{Image}";

        [JsonPropertyName("price")]
        public int Price { get; set; }

        [JsonPropertyName("categoryId")]
        public int CategoryId { get; set; }

        [JsonPropertyName("isAvailable")]
        public bool IsAvailable { get; set; }
    }
}