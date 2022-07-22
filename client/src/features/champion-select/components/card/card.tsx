import Avatar from "boring-avatars";

type CardProps = {
  id: string;
  name: string;
  sideColor: "red" | "blue";
};

export const Card = ({ id, name, sideColor }: CardProps) => {
  return (
    <div
      key={id}
      className={`flex items-center m-4 p-2 bg-slate-900 rounded-md 
    border-l-8 border-${sideColor}-500`}
    >
      <div className="hover:scale-105 transition-transform ease-linear m-2">
        <Avatar
          size={80}
          variant="beam"
          name={id}
          colors={["#E1E6E3", "#BFD6C7", "#C7BD93", "#FF7876", "#574B45"]}
        />
      </div>
      <p className="w-52 truncate text-2xl text-yellow-500">{name}</p>
    </div>
  );
};
