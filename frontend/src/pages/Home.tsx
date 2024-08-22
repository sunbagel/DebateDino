

const Home = () => {
  return (
    
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <div className="p-12 bg-lime-200 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg shadow-lg overflow-hidden min-w-full max-w-4xl">
        <div className="flex flex-row items-center justify-center w-full">
        
          <div className="flex flex-col w-1/2 space-y-4">
            <h1 className="text-5xl font-bold">Debate Dino</h1>
            <p className="text-xl">RAYMOND DEBATEMOND FILLER TEXT DEBATINGDEMONDING</p>
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-black text-white rounded">Get Started</button>
              <button className="px-6 py-2 bg-transparent text-black rounded border border-black">Learn More</button>
            </div>
          </div>
        
          <div className="w-1/2 flex justify-center">
            <img src="../../Debate_Dino_Logo.svg" alt="Debate Tournaments" className="max-w-sm"/>
          </div>
        </div>
        </div>
      </div>
        
        
    
  )
}

export default Home
