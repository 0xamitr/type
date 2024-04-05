'use client'
import Text from './components/text';
import randomText from './Features/RandomText';
import randomCode from './Features/RandomCode'
import { useEffect, useState } from 'react';

// Inside your component or function

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [iscode, setIscode] = useState(false)

  const handle = async() =>{
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' as RequestCredentials,
      withCredentials: true,
    };

    fetch('http://127.0.0.1:5000/protected', fetchOptions)
  }
  const handleClick = () => {
    setIscode(!iscode)
  }
  const fetchRandomText = () => {
    let random;
    if(iscode)
      random =  randomCode();
    else
      random = randomText();
    setText(random);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchRandomText();
  }, [iscode]);

  return (
    <>
      <div className="container">
        <p>Code(beta)</p>
        <label onClick={handleClick} className={`switch ${iscode ? 'checked' : ''}`}>
          <div></div>
        </label>
      </div>
      <div id='text'>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Text text={text} fetchRandomText={fetchRandomText} />
        )}
      </div>
      <button onClick={handle}></button>
    </>
  );
}