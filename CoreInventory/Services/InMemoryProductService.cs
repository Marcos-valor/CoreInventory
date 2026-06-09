using CoreInventory.Models;

namespace CoreInventory.Services;

public class InMemoryProductService
{
    private readonly List<Product> _products =
    [
        new Product
        {
            Id = 1,
            Nombre = "Notebook Lenovo",
            Precio = 850000,
            Stock = 5
        },

        new Product
        {
            Id = 2,
            Nombre = "Mouse Logitech",
            Precio = 25000,
            Stock = 20
        },

        new Product
        {
            Id = 3,
            Nombre = "Monitor Samsung",
            Precio = 180000,
            Stock = 8
        }
    ];

    public List<Product> GetAll()
    {
        return _products;
    }
}