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
  useEffect(() => {
    fetchRandomText();
  }, [iscode]);

  return (
    <>
      <div id='text'>
        <div className="container">
          <h3 id = "p" className='test'>Code (Beta)</h3>
          <label onClick={handleClick} className={`switch ${iscode ? 'checked' : ''}`}>
            <div></div>
          </label>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Text text={text} iscode={iscode} fetchRandomText={fetchRandomText} />
        )}
      </div>
    </>
  );
}