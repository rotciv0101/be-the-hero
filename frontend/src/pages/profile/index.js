import React, {useState, useEffect} from 'react'; 
import logoImg from '../../assets/logo.svg';

import {Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2} from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';

export default function Profile() {
     const [incidents, setIncidents] = useState([]);
     const ongName = localStorage.getItem('ongName');
     const ongId = localStorage.getItem('ongId');
     const history = useHistory();
     
     useEffect(() => { 
          api.get('profile', { 
               headers: { 
                    Authorization: ongId, 
               }
          }).then(response => { 
               setIncidents(response.data);
          })
     }, [ongId]);

     async function handlerDeleteIncident(id) { 
          try { 
               await api.delete(`incidents/${id}`, { 
                    headers: { 
                         Authorization: ongId,
                    }
               });

               setIncidents(incidents.filter(incidents => incidents.id !== id));
          } catch (err) { 
               alert('Erro ao deletar caso, tente novamente.');
          }
     }

     function handleLogout() { 
          localStorage.clear();

          history.push('/');
     }

     return ( 
          <div className="profile-container">
               <header>
                    <img src={logoImg} alt="Be the Hero"/>
                    <spam>Bem vinda, {ongName}</spam>
                    <Link className="button" to ="/incidents/new">Cadastrar novo caso</Link>
                    <button onClick={handleLogout} type="button">
                         <FiPower size={18} color="#E02041"/>
                    </button>
               </header>
               <h1>Casos cadastrados</h1>

               <ul>
                    {incidents.map(incidents => (
                         <li key={incidents.id}>
                              <strong>CASO:</strong>
                              <p>{incidents.title}</p>

                              <strong>DESCRIÇÃO:</strong>
                              <p>{incidents.description}</p>

                              <strong>VALOR:</strong>
                              <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incidents.value)}</p>

                              <button onClick={() => handlerDeleteIncident(incidents.id)} type="button">
                                   <FiTrash2 size={20} color="#a8a8b3"/>
                              </button>
                    </li>
                    ))}
               </ul>
          </div>
     );
}