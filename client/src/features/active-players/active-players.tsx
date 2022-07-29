import { useActivePlayers } from "../../hooks";

export const ActivePlayers = () => {
  const { data: activePlayers } = useActivePlayers();

  return (
    <div className="fixed top-8 right-8">
      <span className="text-xl font-light text-yellow-500 mr-1">
        Active Players:
      </span>
      <span className="text-2xl font-semibold text-green-500">
        {activePlayers}
      </span>
    </div>
  );
};
