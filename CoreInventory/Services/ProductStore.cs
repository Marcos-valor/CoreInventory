using System.Collections.Concurrent;
using CoreInventory.Models;

namespace CoreInventory.Services;

/// <summary>
/// Simple thread-safe in-memory product store seeded with sample data.
/// Lets the API run end-to-end without a database. Swap for a real
/// EF Core / database-backed implementation later.
/// </summary>
public class ProductStore
{
    private readonly ConcurrentDictionary<int, Product> _products = new();
    private int _nextId;

    public ProductStore()
    {
        var seed = new[]
        {
            new Product { Name = "Mechanical Keyboard", Description = "Hot-swappable 75% keyboard with PBT keycaps", Price = 129.99m, Stock = 42, Category = "Peripherals" },
            new Product { Name = "USB-C Hub", Description = "7-in-1 aluminium hub with 4K HDMI and PD charging", Price = 49.50m, Stock = 0, Category = "Accessories" },
            new Product { Name = "27\" 4K Monitor", Description = "IPS panel, 99% sRGB, USB-C 90W power delivery", Price = 399.00m, Stock = 17, Category = "Displays" },
            new Product { Name = "Noise-Cancelling Headphones", Description = "Over-ear ANC headphones with 30h battery life", Price = 219.99m, Stock = 8, Category = "Audio" },
            new Product { Name = "Ergonomic Mouse", Description = "Vertical wireless mouse with programmable buttons", Price = 64.00m, Stock = 120, Category = "Peripherals" },
            new Product { Name = "Laptop Stand", Description = "Adjustable aluminium stand with cable management", Price = 34.95m, Stock = 3, Category = "Accessories" },
            new Product { Name = "1080p Webcam", Description = "Auto-focus webcam with dual noise-reducing mics", Price = 79.00m, Stock = 56, Category = "Peripherals" },
        };

        foreach (var p in seed)
        {
            var id = Interlocked.Increment(ref _nextId);
            p.Id = id;
            _products[id] = p;
        }
    }

    public IEnumerable<Product> GetAll() => _products.Values.OrderBy(p => p.Id);

    public Product? Get(int id) => _products.TryGetValue(id, out var product) ? product : null;

    public Product Add(Product product)
    {
        var id = Interlocked.Increment(ref _nextId);
        product.Id = id;
        _products[id] = product;
        return product;
    }

    public bool Update(int id, Product updated)
    {
        if (!_products.ContainsKey(id)) return false;
        updated.Id = id;
        _products[id] = updated;
        return true;
    }

    public bool Delete(int id) => _products.TryRemove(id, out _);
}
