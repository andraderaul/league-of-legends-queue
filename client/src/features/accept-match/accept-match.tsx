type AcceptMatchProps = {
  onMatch: () => void;
};

export const AcceptMatch = ({ onMatch }: AcceptMatchProps) => {
  return (
    <div
      className="absolute z-10
      w-96 h-96 bg-slate-600/60 rounded-full 
      flex items-center justify-center"
    >
      <div className="flex flex-col">
        <button
          className="mb-2 bg-green-500 rounded-lg
          w-44 h-12 text-white 
          hover:bg-green-600 hover:scale-110 
          transition-transform ease-linear"
          onClick={onMatch}
        >
          Accept
        </button>
        <button
          className="mt-2 bg-red-500 rounded-lg
          w-44 h-12 text-white 
          hover:bg-red-600 hover:scale-110 
          transition-transform ease-linear"
          onClick={onMatch}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
