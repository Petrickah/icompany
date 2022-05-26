import './styles/App.css';
import Menu from './Menu';
import background from './images/Business.png'
import search from './images/search.svg'
import { useState } from 'react';

async function getCompany(url='', args={}) {
  var final_url = `${url}?cui=${args['cui']}&data=${args['data']}`
  const response = await fetch(final_url, {
    method:'get',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response;
}

async function retrieveBalance(company) {
  var url = company['url']
  if (url != null) {
    var getBalance = async (url) => {
      const response = await fetch(url, {
        method:'get',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return response;
    };
    return getBalance(url)
      .then((response) => response.json())
      .then((json) => json)
  }
}

function IndicatorEconomic(props) {
  return (
    <div className='indicator-economic'>
      <div className='indicator-label'>{props.label}</div>
      <div className='indicator-value'>{props.value}</div>
    </div>
  )
}

function CompanyBalance(props) {
  if (props.balance != null) {
    var balance = props.balance;
    return (
      <div id="indicatori" className='App-Indicatori'>
        <div className='section-title'>Indicatori Economici</div>
        <div className='section-content'>{
          balance.i.map((indicator) => {
            return (
              <IndicatorEconomic label={indicator['val_den_indicator']} value={indicator['val_indicator']}/>
            );
          })
        }</div>
      </div>
    );
  }
}

function CompanyData(props) {
  var company = props.company
  if (company != null) {
    var scopTVA = 'NEINREGISTRAT în scop TVA'
    if (company['scopTVA']) {
      var data = company['data_inceput_scopTVA'].split("-")
      data = `${data[2]}.${data[1]}.${data[0]}`
      scopTVA = `INREGISTRAT în scop TVA din data de ${data}`
    }
    return (
      <div className='company-data'>
        <p className='company-content'>{company['denumire']}</p>
        <p className='company-content'>{company['adresa']}</p>
        <p className='company-content'>Număr ONRC: {company['nrRegCom']}</p>
        <p className='company-content'>{company['stare']}</p>
        <p className='company-content'>{scopTVA}</p>
      </div>
    );
  }
  return (
    <div className='company-data'>
      <p className='company-content'>Compania căutată nu a putut fi găsită!</p>
      <p className='company-content'>Încercați cu un alt CUI.</p>
    </div>
  )
}

function App() {
  const [state, setState] = useState({value: ''});
  const [company, setCompany] = useState({});
  const [balance, setBalance] = useState(null);

  function handleChange(event) {
    setState({value: event.target.value});
  }

  function handleSubmit(event) {
    var url_api = "http://127.0.0.1:5000/api/v1/cauta";
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() >= 10 ? `${date.getMonth()}` : `0${date.getMonth()}`;
    var day = date.getDay() >= 10 ? `${date.getDay()}` : `0${date.getDay()}`;

    getCompany(url_api, {"cui": state.value, "data": `${year}-${month}-${day}`})
      .then((response) => response.json())
      .then((company) => {
        setCompany(company);
        retrieveBalance(company)
          .then((balance) => setBalance(balance));
      });

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
              <a href="#indicatori" onClick={handleSubmit}>
                <img src={search} alt="search-icon" className='search-icon'/>
              </a>
            </div>
            <CompanyData company={company['date']}/>
        </div>
      </header>
      <CompanyBalance balance={balance}/>
    </div>
  );
}

export default App;
