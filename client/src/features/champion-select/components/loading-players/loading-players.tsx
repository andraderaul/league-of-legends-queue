import { useId, useMemo } from "react";
import Avatar from "boring-avatars";

const VITE_NUMBER_PLAYERS_PER_SIDE = import.meta.env
  .VITE_NUMBER_PLAYERS_PER_SIDE;

export const LoadingPlayers = ({ length }: { length: number }) => {
  const id = useId();

  const players = useMemo(
    () => Math.abs(VITE_NUMBER_PLAYERS_PER_SIDE - length),
    [length]
  );

  return (
    <>
      {Array(players)
        .fill(0)
        .map((_, index) => (
          <div
            key={`${id + index}`}
            className="flex items-center m-4 p-2 
          bg-gray-900 rounded-md border-l-8 border-yellow-500"
          >
            <div className="m-2 animate-pulse">
              <Avatar
                size={80}
                variant="beam"
                name={`${id + index}`}
                colors={["#E1E6E3", "#BFD6C7", "#C7BD93", "#FF7876", "#574B45"]}
              />
            </div>
            <div className="animate-pulse w-52 h-4 bg-slate-500 rounded-md" />
          </div>
        ))}
    </>
  );
};
