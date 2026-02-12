import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// CONFIGURACIÓN (Pon tus datos aquí)
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
    await supabase.from('flota').update({ estado: nuevoEstado }).eq('id', id)
    getCarros()
  }

  // Colores según estado
  const getColor = (estado) => {
    switch (estado) {
      case 'En Renta': return '#FFC107'; // Amarillo
      case 'Activo': return '#0D6EFD';   // Azul
      case 'En Taller': return '#DC3545'; // Rojo
      default: return '#198754';         // Verde (Disponible)
    }
  }

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      {/* HEADER */}
      <nav style={{ backgroundColor: '#1a237e', color: 'white', padding: '15px 20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, letterSpacing: '1px' }}>NEXUS FLEET</h2>
        <span style={{ fontSize: '12px', opacity: 0.8 }}>Gestión de Flota · El Salvador</span>
      </nav>

      <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
        
        {/* FORMULARIO COMPACTO */}
        <section style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
          <h4 style={{ marginTop: 0, color: '#333' }}>+ Registrar Vehículo</h4>
          <form onSubmit={agregarCarro} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Nombre (ej: Nissan Versa)" value={nombre} onChange={(e) => setNombre(e.target.value)} required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} />
            <input placeholder="Número de Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} />
            <button type="submit" style={{ padding: '12px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              GUARDAR EN FLOTA
            </button>
          </form>
        </section>

        {/* LISTADO DE TARJETAS */}
        <div style={{ display: 'grid', gap: '15px' }}>
          {carros.map((carro) => (
            <div key={carro.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '15px', 
              padding: '18px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderLeft: `6px solid ${getColor(carro.estado)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#1a237e' }}>{carro.nombre_vehiculo}</h3>
                  <span style={{ fontSize: '14px', color: '#666', fontWeight: 'bold' }}>{carro.placa}</span>
                </div>
                <button onClick={() => eliminarCarro(carro.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select 
                  value={carro.estado} 
                  onChange={(e) => actualizarEstado(carro.id, e.target.value)}
                  style={{ 
                    flex: 1,
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: `2px solid ${getColor(carro.estado)}`,
                    backgroundColor: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  <option value="Disponible">🟢 Disponible</option>
                  <option value="En Renta">🟡 En Renta</option>
                  <option value="Activo">🔵 Activo (Plataforma)</option>
                  <option value="En Taller">🔴 En Taller</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App