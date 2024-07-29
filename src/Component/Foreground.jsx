
import Card from './Card'
import React, {  useRef  } from 'react';

function Foreground() {
  const ref = useRef(null);
  const data = [
    {
      title: "My Portfolio",
      desc: "Hello I am a full stack developer with various languages",
      filesize: ".55mb",
      close: false,
      tag: { 
        isOpen: true, 
        tagTitle: "Download Now", 
        tagColor: "#463b72",
        quote: "< code />",
      },
      githubLink: "https://github.com/Crimemaster12365/myPortfolio",
      downloadLink: "https://github.com/Crimemaster12365/myPortfolio/archive/refs/heads/main.zip"
    },
    {
      title: "Pac-Man Game",
      desc: "Play the classic Pac-Man game right in this card!",
      filesize: "1.2mb",
      close: true,
      tag: { 
        isOpen: true, 
        tagTitle: "Play", 
        tagColor: "#463b72",
        quote: "waka waka waka"
      },
      githubLink: "https://github.com/yourusername/pacman-game",
      downloadLink: "https://github.com/yourusername/pacman-game/archive/refs/heads/main.zip"
    },
    // You can add more card data objects here if needed
  ];

  return (
    <div ref={ref} className='fixed top-0 left-0 z-[3] w-full h-full flex flex-wrap gap-10 p-5'> 
      {data.map((item, index) => (
        <Card key={index} data={item} index={index} reference={ref} />
      ))}
    </div>
  )
}

export default Foreground