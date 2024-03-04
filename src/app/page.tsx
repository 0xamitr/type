'use client'
import Text from './components/text';
import randomText from './Features/RandomText';
import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRandomText = async() => {
    const random =  await randomText();
    setText(random);
    setIsLoading(false);

  };
  useEffect(() => {
    fetchRandomText();
  }, []);

  return (
    <div>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <Text text={text} fetchRandomText={fetchRandomText} />
      )}
    </div>
  );
}