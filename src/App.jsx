import React from 'react'
import Background from './Component/Background';
import Foreground from './Component/Foreground';
function App() {
  return (
    <div className='relative w-full h-screen flex flex-col' style={{ backgroundColor: '#7161B2' }}>
      <Background></Background>
      <Foreground></Foreground>
    </div>

  );
}

export default App