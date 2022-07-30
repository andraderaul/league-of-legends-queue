import { Card } from "../card";

type SideProps = {
  title: string;
  sideColor: "blue" | "red";
  players?: Array<{
    id: string;
    name: string;
  }>;
};

export const Side = ({ players, title, sideColor }: SideProps) => {
  return (
    <div className="mt-10">
      <h1 className={`p-4 m-4 text-5xl text-${sideColor}-500 font-semibold`}>
        {title}
      </h1>
      {players?.map((b) => (
        <Card
          key={b.id}
          sideColor={sideColor}
          id={b.id}
          name={b.name ?? "default"}
        />
      ))}
    </div>
  );
};
