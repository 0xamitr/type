'use client'
import Text from './components/text';
import randomText from './Features/RandomText';
import randomCode from './Features/RandomCode'
import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [iscode, setIscode] = useState(false)

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
  console.log(iscode)
  useEffect(() => {
    fetchRandomText();
  }, [iscode]);

  return (
    <>
      <div className="container">
        <p>Code (BETA)</p>
        <label onClick={handleClick} className={`switch ${iscode ? 'checked' : ''}`}>
          <div></div>
        </label>
      </div>
      <div id='text'>
        {isLoading ? (
          <h2>Loading...</h2>
        ) : (
          <Text text={text} fetchRandomText={fetchRandomText} />
        )}
      </div>
    </>
  );
}