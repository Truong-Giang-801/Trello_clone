import Image from "next/image";
import React from "react";

type TrelloLogoProps = {
  width?: number;
  height?: number;
};

export default function TrelloLogo({
  width = 64,
  height = 64,
}: TrelloLogoProps) {
  return (
    <Image
      src="/images/Trello_logo.svg"
      width={width}
      height={height}
      alt="Trello"
      style={{
        objectFit: "contain",
        height: "auto",
      }}
    />
  );
}
