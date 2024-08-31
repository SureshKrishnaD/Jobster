import getstartImage from './assets/getstart.svg';
import { Link } from 'react-router-dom';
import './app.css';
export default function Getstart() {
    return (
        <>
            <img className="getstartimg" src={getstartImage} alt="Get Started" />
            <p className='startbtncon'><Link className='startbtn' to='/intro'>Get Start</Link></p>

        </>
    );
}
