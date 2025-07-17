// src/App.tsx
function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-gray text-white">
      <h1 className="text-4xl font-bold text-primary-blue mb-4 animate-bounce">
        Tailwind CSS Test
      </h1>
      <p className="text-lg text-dark-gray">
        If you can see styles and bouncing, Tailwind is working!
      </p>
      <button className="mt-6 px-4 py-2 rounded bg-dark-blue hover:bg-primary-blue transition duration-300">
        Test Button
      </button>
    </div>
  );
}

export default App;

