import React from 'react'

function Background() {
  return (
    <>
    <div className='fixed w-full h-screen '>
    <div className='relative w-full h-screen flex flex-col' style={{ backgroundColor: '#7161B2' }}>
      <div className='w-full py-6 text-center' style={{ backgroundColor: '#BCA6C6' }}> 
        Hello.
      </div>
      <div className='flex-grow flex items-center justify-center' style={{marginTop: '5rem',}}>
        <div className='relative'>
          <h5 className='text-[6vw] font-Cigra opacity-95 absolute -top-4 left-0' style={{ color: '#44396F' }}>Th
          <span style={{ fontFamily: 'ribes' }}>e</span>
          <span style={{ fontFamily: 'ribes' }}>.</span>
          </h5>
          <h1 className='text-[13vw] font-ribes opacity-70' style={{ color: '#BCA6C6' }}>
            <span style={{ fontFamily: 'ribes' }}>G</span>
            <span style={{ fontFamily: 'Allright' }}>O</span>
            <span style={{ fontFamily: 'Cigra' }}>D</span>
          </h1>
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default Background