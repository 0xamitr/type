'use client'
import Text from './components/text';
import randomText from './Features/RandomText';
import randomCode from './Features/RandomCode'
import { useEffect, useState } from 'react';
import styles from "./styles.module.css"
import Label from "./components/label"
import createRoom from '@/socket/createRoom';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [iscode, setIscode] = useState(false)
  const router = useRouter();

  const handleClick = () => {
    setIscode(!iscode)
  }
  const fetchRandomText = () => {
    let random;
    if (iscode)
      random = randomCode();
    else
      random = randomText();
    setText(random);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchRandomText();
  }, [iscode]);

  function handleRoomCreation(){
    createRoom((room_id) => {
      router.push(`/room/${room_id}`);
    });
  }
  
  return (
    <>
      <div id={styles.text}>
        <Label iscode={iscode} setIscode={setIscode} />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Text text={text} iscode={iscode} fetchRandomText={fetchRandomText} />
        )}
      </div>

      <button onClick={handleRoomCreation} type={"button"}>CREATE ROOM</button>
    </>
  );
}