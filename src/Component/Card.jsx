import React, { useState, useRef, useEffect } from 'react';
import { FaRegFileAlt } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";
import { GrInstagram } from "react-icons/gr";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import SnakeGame from './Games/Snake';
import PacManGame from './Games/PacManGame';
import { motion } from "framer-motion"

function Card({ data, index , reference}) {
  const [isGameActive, setIsGameActive] = useState(false);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      setCardSize({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      });
    }
  }, []);

  const startGame = () => {
    setIsGameActive(true);
  };

  const endGame = () => {
    setIsGameActive(false);
  };

  const renderGame = () => {
    if (index === 0) {
      return <SnakeGame onGameOver={endGame} width={cardSize.width} height={cardSize.height} />;
    } else if (index === 1) {
      return <PacManGame onGameOver={endGame} width={cardSize.width} height={cardSize.height} />;
    }
    return null;
  };

  return (
    <motion.div drag dragConstraints={reference}
      ref={cardRef} 
      className='relative w-60 h-72 bg-[#2A224B] rounded-[40px] overflow-hidden'
    >
      {!isGameActive ? (
        <div className='py-[60px] px-6 flex flex-col h-full'>
          <div className='flex gap-2 left-0 items-center'>
            <FaRegFileAlt className='' style={{ color: '#bca6c6' }} />
            <h3 className='text-[#bca6c6] font-semibold text-sm'>{data.title}</h3>
          </div>
          <p className='text-sm leading-tight mt-5 font-semibold text-[#bca6c6]'>
            {data.desc}
          </p>
          {data.tag.isOpen && (
            <div 
              className={`tag absolute top-0 right-0 px-4 py-2 ${data.tag.tagColor === "#463b72" ? "bg-[#463b72]" : "bg-blue-600"} rounded-bl-2xl text-xs font-mono cursor-pointer`}
              onClick={startGame}
            >
              <div className="animate-pulse">
                {data.tag.quote}
              </div>
            </div>
          )}
          <div className='footer absolute bottom-0 left-0 bg-[#BCA6C6] w-full py-4 px-1'>
            <div className='flex px-4'>
              <h5 className='' style={{ color: '#2A224B' }}>{data.filesize}</h5>
              <div className='w-full flex items-center' style={{paddingLeft: '4.3rem'}}>
                <div className='flex gap-2'>
                  <IconButton Icon={GrInstagram} />
                  <IconButton Icon={FiGithub} link={data.githubLink} />
                  <IconButton Icon={HiOutlineDocumentDownload} link={data.downloadLink} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        renderGame()
      )}
    </motion.div>
  )
}

function IconButton({ Icon, link }) {
  const handleClick = () => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <span className='w-6 h-6 rounded-full flex items-center justify-center bg-[#2A224B] cursor-pointer' onClick={handleClick}>
      <Icon color='#bca6c6' size='0.8em' />
    </span>
  )
}

export default Card;