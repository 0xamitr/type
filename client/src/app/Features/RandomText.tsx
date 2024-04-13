import { arr } from '../../../public/wordarray';
import { preparr } from '../../../public/preparray';

export default function randomText(){
    console.log(Math.floor(Math.random() * arr.length))
    const length = Math.floor(Math.random() * (12 - 7) + 7);
    const preplen = Math.floor(Math.random() * (6 - 3) + 3);
    let text = ""
    let i = 0
    let j = 0
    while(i + j < 1 + 1){
      const decide = Math.floor(Math.random()*2)
      if(decide == 0){
        const temp = Math.floor(Math.random() * arr.length)
        text += arr[temp]
        if(i+j < 1+1-1)
          text += " "
        i++;
      }
      else{
        const temp = Math.floor(Math.random() * preparr.length)
        text += preparr[temp]
        if(i+j < 1+1-1)
          text += " "
        j++;
      }
    }
    return text
}