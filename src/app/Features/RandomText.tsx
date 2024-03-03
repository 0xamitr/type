export default function randomText(){
    const text = [
        "Hello, I am under the water. Here too much raining!",
        "Who are you, I dont know. Please introduce yourself",
        "Hi! This is detective Sherlock Holmes and I am here to arrest you.",
        "Where were you at 9/11. I was at Home eating dorittos. NO!",
        "Why are you the way you are. Please change.",
        "The earth is dying and so are you.",
        "Change the bloody curtains and dont forget to smile."
    ]
    return(text[Math.floor(Math.random() * text.length)])
}