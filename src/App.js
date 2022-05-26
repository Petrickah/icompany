import './styles/App.css';
import Menu from './Menu';
import background from './images/Business.png'
import search from './images/search.svg'
import { useState } from 'react';

async function getCompany(url='', data=[]) {
  console.log(data);
  const response = await fetch(url, {
    method:'post',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response;
}

function App() {
  const [state, setState] = useState({value: ''})

  function handleChange(event) {
    setState({value: event.target.value});
  }

  function handleSubmit(event) {
    var url_api = "https://webservicesp.anaf.ro/PlatitorTvaRest/api/v6/ws/tva";
    // var date = new Date();
    // var year = date.getFullYear();
    // var month = date.getMonth() >= 10 ? `${date.getMonth()}` : `0${date.getMonth()}`;
    // var day = date.getDay() >= 10 ? `${date.getDay()}` : `0${date.getDay()}`;

    getCompany(url_api, [
      {
        "cui": state.value,
        "data": "2022-05-25",
      }
    ])
    .then((data) => console.log(data));

    event.preventDefault();
  }

  return (
    <div className="App">
      <Menu />
      <header className="App-header">
        <div className="App-background" style={{ backgroundImage: `url(${background})`}}>
            <div className='App-title'>
              <p className='title'>iCompany</p>
              Want to search for companies in an easy way?
            </div>
            <div className='App-search'>
              <input className="search-box" type="text" name="company" 
                value={state.value} onChange={handleChange} onSubmit={handleSubmit}
                placeholder="Introduce-ți CUI al firmei"/>
              <a href="https://#" onClick={handleSubmit}>
                <img src={search} alt="search-icon" className='search-icon'/>
              </a>
            </div>
        </div>
      </header>
    </div>
  );
}

export default App;
