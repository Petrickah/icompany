import tesagon from './images/tesagon.svg';
import './styles/menu.css';

function Menu() {
    return (
        <header className='menu'>
        <a href="https://www.tesagon.com/"><img src={tesagon} className="tesagon-logo" alt="tesagon"/></a>
        <div className='menu-list'>
            <a className='menu-item' href="https://about.tesagon.com/">Home</a>
            <a className='menu-item' href="https://about.tesagon.com/press-releases/">Press</a>
            <a className='menu-item' href="https://about.tesagon.com/contact/">Contact</a>
            <a className='menu-item menu-selected' href="https://#">ICompany</a>
        </div>
        </header>
    )
}

export default Menu