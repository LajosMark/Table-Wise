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


        [JsonPropertyName("icon")]
        public string Image { get; set; }

        [JsonIgnore]
        public string LocalIconSource => Id switch
        {
            1 => "bruschetta.png",   // appetizers
            2 => "tomatosoup.png",  // soup
            3 => "grilledchiken.jpg", //maincourse
            4 => "margaritapizza.jpg", // pizza
            5 => "pastacarbonara.jpg", // pasta
            6 => "greeksalad.jpg", // salad
            7 => "tiramisu.jpg", // dessert
            8 => "espresso.jpg", // bevarages
            9 => "frenchfries.jpg", // sides
            10 => "smallpizza.jpg", // kids menu
            _ => "cheese_burger.jpg"   // Minden más esetben
        };
    }
}
