import { useState } from 'react';
import './Hirer.css';
import create from './assets/create.svg';
import backbtn from './assets/backbtn.svg';

export default function Hirerhome() {
    const [showhirertype, setShowhirertype] = useState(true);
    function backfunction() {
        window.history.back();
    }
    return (
        <>
            <img className='createimg' src={create} alt="" />
            <div className="blurcon">
                {showhirertype && (
                    <div className="hirertype">
                        <img onClick={backfunction} src={backbtn} alt="" className="backbtn" />
                        <h1 className='question1'>What type of Organization <br /> you are ?</h1>
                        <ul>
                            <li>Induvidual</li>
                            <li>Company</li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    )
}
