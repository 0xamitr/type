import { arr } from '../../../public/wordarray';

export default async function randomText(){
    console.log(Math.floor(Math.random() * arr.length))
    const length = Math.random() * (15 - 10) + 10;
    let text = ""
    for(let i = 0; i < length; i++){
      const temp = Math.floor(Math.random() * arr.length)
      text += arr[temp]
      if(i < length-1)
        text += " "
    }
    console.log(text)
    return text
}