import { Side } from "./components";

type ChampionSelectProps = {
  sides: {
    blueSide: Array<{
      id: string;
      name: string;
    }>;
    redSide: Array<{
      id: string;
      name: string;
    }>;
  };
};

export const ChampionSelect = ({ sides }: ChampionSelectProps) => {
  return (
    <div className="flex flex-col">
      <h1 className="p-10 text-6xl text-center font-bold text-yellow-500">
        Champion Select
      </h1>
      <div className="grid grid-cols-4 gap-4">
        <Side title="Blue Side" players={sides.blueSide} sideColor="blue" />
        <div className="rounded-full col-span-2"></div>
        <Side title="Red Side" players={sides.redSide} sideColor="red" />
      </div>
    </div>
  );
};
