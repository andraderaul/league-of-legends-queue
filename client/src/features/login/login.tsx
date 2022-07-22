type LoginProps = {
  onChange: any;
  onClick: any;
};

export const Login = ({ onChange, onClick }: LoginProps) => {
  return (
    <div className="flex items-end">
      <div>
        <p className="text-2xl text-yellow-500">Username</p>
        <input
          type="text"
          className="mt-1 px-3 py-2 bg-white border shadow-sm 
            border-slate-200 placeholder-slate-300 focus:outline-none 
            focus:border-yellow-500 focus:ring-yellow-500 block rounded-md sm:text-sm focus:ring-1"
          onChange={onChange}
        />
      </div>
      <button
        className="bg-red-500 rounded-lg
          w-16 h-16 ml-4 text-white text-xl
          hover:bg-red-600 hover:scale-110 
          transition-transform ease-linear"
        onClick={onClick}
      >
        Play
      </button>
    </div>
  );
};
