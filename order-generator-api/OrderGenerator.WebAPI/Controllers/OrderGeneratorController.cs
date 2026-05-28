using System.ComponentModel.DataAnnotations;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using OrderGenerator.Contract.Requests;
using OrderGenerator.Contract.Responses;
using OrderGenerator.Domain.Services;

namespace OrderGenerator.WebAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class OrderGeneratorController(IOrderGeneratorService orderGeneratorService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(OrderResponse), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> GenerateOrder([FromBody][Required] OrderRequest orderRequest, CancellationToken cancellationToken)
    {
        var result = await orderGeneratorService.GenerateOrders(orderRequest, cancellationToken);
        return Ok(result);
    }

}
