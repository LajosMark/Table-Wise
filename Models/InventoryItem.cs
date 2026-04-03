using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableWise.Models;

public class InventoryItem
{
    public string Name { get; set; }
    public double CurrentAmount { get; set; }
    public double MaxAmount { get; set; }
    public string Unit { get; set; }


    public double Progress => CurrentAmount / MaxAmount;


    public Color StatusColor => Progress <= 0.15 ? Colors.Red : Colors.SeaGreen;


    public bool ShowWarning => Progress <= 0.15;
}