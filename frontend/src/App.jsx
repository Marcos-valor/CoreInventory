import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:5193/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los productos')
        }

        return response.json()
      })
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudo conectar con la API')
        setLoading(false)
      })
  }, [])

  return (
    <main className="container">
      <h1>CoreInventory</h1>
      <p>Sistema de gestión de inventario</p>

      {loading && <p>Cargando productos...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.nombre}</td>
                <td>${product.precio}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default App