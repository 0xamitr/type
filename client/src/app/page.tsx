'use client'
import Text from './components/text';
import randomText from './Features/RandomText';
import randomCode from './Features/RandomCode'
import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [iscode, setIscode] = useState(false)

  const handlesomething = ()=>{
    fetch(process.env.NEXT_PUBLIC_API + "/reset", {
      mode: 'no-cors' 

    })
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
      <button onClick={handlesomething}></button>
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
          <Text text={text} iscode={iscode} fetchRandomText={fetchRandomText} />
        )}
      </div>

    </>
  );
}