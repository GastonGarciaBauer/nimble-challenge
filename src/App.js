import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_URL = "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

function App() {
  // Estados para guardar la info
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const myEmail = "gaston.garcia.bauer89@gmail.com"; 

  // Cargo datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Step 2: Obtengo mis datos de candidato
        const resCand = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${myEmail}`);
        const dataCand = await resCand.json();
        setCandidate(dataCand);

        // Step 3: Obtengo la lista de posiciones
        const resJobs = await fetch(`${BASE_URL}/api/jobs/get-list`);
        const dataJobs = await resJobs.json();
        setJobs(dataJobs);
      } catch (error) {
        setMessage("Error al cargar los datos iniciales");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Step 5: Función para enviar la postulación
  const handleApply = async (jobId) => {
    if (!repoUrl) {
      alert("Por favor, ingresa la URL de tu repo");
      return;
    }

    const payload = {
      uuid: candidate.uuid,
      jobId: jobId,
      candidateId: candidate.candidateId,
      applicationId: candidate.applicationId,
      repoUrl: repoUrl
    };

    try {
      const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.ok) {
        alert("¡Postulación enviada con éxito!");
      } else {
        alert("Error: " + (result.message || "No se pudo enviar"));
      }
    } catch (error) {
      alert("Hubo un error de red");
    }
  };

  if (loading) return <div className="App">Cargando...</div>;

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Challenge Nimble Gravity</h1>
      
      {candidate && (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Mis Datos:</h3>
          <p>Nombre: {candidate.firstName} {candidate.lastName}</p>
          <p>Email: {candidate.email}</p>
        </div>
      )}

      <h2>Posiciones Abiertas</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Step 4: Muestro lista de posiciones abiertas*/}
        {jobs.map(job => (
          <div key={job.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <strong>{job.title}</strong>
            <div style={{ marginTop: '10px' }}>
              <input 
                type="text" 
                placeholder="URL de tu repo GitHub" 
                onChange={(e) => setRepoUrl(e.target.value)}
                style={{ marginRight: '10px', width: '250px' }}
              />
              <button onClick={() => handleApply(job.id)}>Submit</button>
            </div>
          </div>
        ))}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
