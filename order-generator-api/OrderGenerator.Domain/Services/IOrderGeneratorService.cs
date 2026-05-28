using OrderGenerator.Contract.Requests;
using OrderGenerator.Contract.Responses;

namespace OrderGenerator.Domain.Services;

public interface IOrderGeneratorService
{
    Task<OrderResponse> GenerateOrders(OrderRequest request, CancellationToken cancellationToken);
}