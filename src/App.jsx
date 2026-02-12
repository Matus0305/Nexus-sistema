import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ajdsaqvxicjyahrcqzby.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZHNhcXZ4aWNqeWFocmNxemJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NTQ3MjMsImV4cCI6MjA4NjQzMDcyM30.25RdfaZ-dYVg02YIT6b6kH3ljAPV2ZWLwOCbCXCfHwk')

function App() {
  const [carros, setCarros] = useState([])
  const [nombre, setNombre] = useState('')
  const [placa, setPlaca] = useState('')

  useEffect(() => { getCarros() }, [])

  async function getCarros() {
    const { data } = await supabase.from('flota').select().order('id', { ascending: false })
    setCarros(data || [])
  }

  async function agregarCarro(e) {
    e.preventDefault()
    await supabase.from('flota').insert([{ nombre_vehiculo: nombre, placa: placa, estado: 'Disponible' }])
    setNombre(''); setPlaca(''); getCarros()
  }

  async function eliminarCarro(id) {
    if (window.confirm("¿Eliminar este vehículo de Nexus?")) {
      await supabase.from('flota').delete().eq('id', id)
      getCarros()
    }
  }

  async function actualizarEstado(id, nuevoEstado) {
    const { error } = await supabase
      .from('flota')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      getCarros();
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '800px', margin: 'auto' }}>
      <h1>Nexus Fleet Manager 🚗</h1>
      
      <form onSubmit={agregarCarro} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f0f4f8', borderRadius: '10px' }}>
        <input placeholder="Vehículo" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ padding: '10px', marginRight: '10px' }} />
        <input placeholder="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} required style={{ padding: '10px', marginRight: '10px' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>Guardar</button>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {carros.map((carro) => (
          <div key={carro.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
            <div>
              <strong>{carro.nombre_vehiculo}</strong>
              <div style={{ fontSize: '0.8em', color: '#666' }}>{carro.placa}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
  {/* Selector de Estado */}
  <select 
  value={carro.estado} 
  onChange={(e) => actualizarEstado(carro.id, e.target.value)}
  style={{ 
    padding: '8px', 
    borderRadius: '5px', 
    border: '1px solid #ccc',
    fontWeight: 'bold',
    backgroundColor: 
      carro.estado === 'En Renta' ? '#fff3cd' : // Amarillo (Renta)
      carro.estado === 'Activo' ? '#cfe2ff' :    // Azul (Tú operándolo)
      carro.estado === 'En Taller' ? '#f8d7da' : // Rojo (Mantenimiento)
      '#d4edda'                                  // Verde (Disponible)
  }}
>
  <option value="Disponible">Disponible</option>
  <option value="En Renta">En Renta</option>
  <option value="Activo">Activo</option>
  <option value="En Taller">En Taller</option>
</select>

  {/* Botón Eliminar (el que ya tenías) */}
  <button onClick={() => eliminarCarro(carro.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer' }}>
    Eliminar
  </button>
</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App