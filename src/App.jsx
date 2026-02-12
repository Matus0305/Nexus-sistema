import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// CONFIGURACIÓN - Mantén tus credenciales aquí
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

  const getStatusStyle = (estado) => {
    switch (estado) {
      case 'En Renta': return { color: '#FFD60A', shadow: 'rgba(255, 214, 10, 0.3)' }; // Gold
      case 'Activo': return { color: '#0A84FF', shadow: 'rgba(10, 132, 255, 0.3)' };   // Electric Blue
      case 'En Taller': return { color: '#FF453A', shadow: 'rgba(255, 69, 58, 0.3)' };  // Red
      default: return { color: '#32D74B', shadow: 'rgba(50, 215, 75, 0.3)' };         // Green
    }
  }

  return (
    <div style={{ 
      backgroundColor: '#000000', 
      minHeight: '100vh', 
      color: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      {/* HEADER PREMIUM */}
      <header style={{ padding: '40px 0 30px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '34px', fontWeight: '700', margin: 0, letterSpacing: '-1px' }}>Nexus</h1>
        <p style={{ color: '#86868b', fontSize: '16px', margin: '5px 0' }}>Flota Operativa</p>
      </header>

      <div style={{ maxWidth: '480px', margin: 'auto' }}>
        
        {/* PANEL DE REGISTRO MINIMALISTA */}
        <section style={{ 
          background: '#121212', 
          padding: '25px', 
          borderRadius: '24px', 
          marginBottom: '35px',
          border: '1px solid #2c2c2e'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              placeholder="Vehículo" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              style={{ background: '#1c1c1e', border: '1px solid #2c2c2e', padding: '16px', borderRadius: '14px', color: '#fff', fontSize: '16px', outline: 'none' }}
            />
            <input 
              placeholder="Placa" 
              value={placa} 
              onChange={(e) => setPlaca(e.target.value)}
              style={{ background: '#1c1c1e', border: '1px solid #2c2c2e', padding: '16px', borderRadius: '14px', color: '#fff', fontSize: '16px', outline: 'none' }}
            />
            <button 
              onClick={async () => {
                await supabase.from('flota').insert([{ nombre_vehiculo: nombre, placa: placa, estado: 'Disponible' }]);
                setNombre(''); setPlaca(''); getCarros();
              }}
              style={{ background: '#fff', color: '#000', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', marginTop: '5px' }}
            >
              Agregar a la Flota
            </button>
          </div>
        </section>

        {/* LISTADO DE TARJETAS GLASS */}
        <div style={{ display: 'grid', gap: '18px' }}>
          {carros.map((carro) => {
            const style = getStatusStyle(carro.estado);
            return (
              <div key={carro.id} style={{ 
                background: 'rgba(28, 28, 30, 0.6)', 
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                borderRadius: '28px', 
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '600', color: '#F5F5F7' }}>{carro.nombre_vehiculo}</h3>
                    <p style={{ margin: '4px 0', color: '#86868b', fontSize: '14px', fontWeight: '500' }}>{carro.placa}</p>
                  </div>
                  <div style={{ 
                    padding: '6px 14px', 
                    borderRadius: '20px', 
                    fontSize: '11px', 
                    fontWeight: '800', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backgroundColor: style.shadow,
                    color: style.color,
                    border: `1px solid ${style.color}`
                  }}>
                    {carro.estado}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <select 
                    value={carro.estado} 
                    onChange={async (e) => {
                      await supabase.from('flota').update({ estado: e.target.value }).eq('id', carro.id);
                      getCarros();
                    }}
                    style={{ 
                      flex: 1, background: '#2c2c2e', color: '#fff', border: 'none', 
                      padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '500', outline: 'none'
                    }}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En Renta">En Renta</option>
                    <option value="Activo">Activo</option>
                    <option value="En Taller">En Taller</option>
                  </select>
                  
                  <button 
                    onClick={async () => { if(confirm('¿Eliminar unidad?')) { await supabase.from('flota').delete().eq('id', carro.id); getCarros(); } }}
                    style={{ background: '#1c1c1e', border: '1px solid #2c2c2e', color: '#FF453A', padding: '14px', borderRadius: '12px', cursor: 'pointer', width: '50px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App