const Loading: React.FC = () => {
  return (
    <div className="flex justify-center mt-12 h-screen">
      <div className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full animate-spin-slow"></div>
    </div>
  );
};
  
export default Loading;