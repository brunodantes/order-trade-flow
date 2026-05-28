using OrderGenerator.Contract.Requests;
using OrderGenerator.Contract.Responses;
using OrderGenerator.Domain.Services;

namespace OrderGenerator.Application.Services;

public class OrderGeneratorService : IOrderGeneratorService
{
    public Task<OrderResponse> GenerateOrders(OrderRequest request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}