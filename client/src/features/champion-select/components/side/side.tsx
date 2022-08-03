import { Card } from "../card";
import { useMemo } from "react";

type SideProps = {
  title: string;
  sideColor: "blue" | "red";
  players?: Array<{
    id: string;
    name: string;
  }>;
};

export const Side = ({ players, title, sideColor }: SideProps) => {
  const style = useMemo(
    () =>
      `p-4 m-4 text-5xl ${
        sideColor === "blue" ? "text-blue-500" : "text-red-500"
      } font-semibold`,
    [sideColor]
  );

  return (
    <div className="mt-10">
      <h1 className={style}>{title}</h1>
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
