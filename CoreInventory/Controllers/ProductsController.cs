using CoreInventory.Models;
using CoreInventory.Services;
using Microsoft.AspNetCore.Mvc;

namespace CoreInventory.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductStore _store;

    public ProductsController(ProductStore store)
    {
        _store = store;
    }

    // GET /api/products
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetAll() => Ok(_store.GetAll());

    // GET /api/products/5
    [HttpGet("{id:int}")]
    public ActionResult<Product> GetById(int id)
    {
        var product = _store.Get(id);
        return product is null ? NotFound() : Ok(product);
    }

    // POST /api/products
    [HttpPost]
    public ActionResult<Product> Create([FromBody] Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Name))
            return BadRequest("Name is required.");

        var created = _store.Add(product);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/products/5
    [HttpPut("{id:int}")]
    public ActionResult<Product> Update(int id, [FromBody] Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Name))
            return BadRequest("Name is required.");

        return _store.Update(id, product) ? Ok(product) : NotFound();
    }

    // DELETE /api/products/5
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id) => _store.Delete(id) ? NoContent() : NotFound();
}
