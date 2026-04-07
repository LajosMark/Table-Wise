using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableWise.Models
{
    public class CategoryGroup : ObservableCollection<FoodItem>
    {
        public string Name { get; private set; }
        public CategoryGroup(string name, List<FoodItem> items) : base(items)
        {
            Name = name;
        }
    }
}
