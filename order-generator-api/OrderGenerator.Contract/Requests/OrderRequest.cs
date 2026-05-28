using OrderGenerator.Contract.Enums;

namespace OrderGenerator.Contract.Requests
{
    public class OrderRequest
    {
        public Symbol Type { get; set; }
        public Side Side { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}