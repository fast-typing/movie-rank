import React, { ReactNode } from "react";

interface Props {
  content: ReactNode;
  additionalStyles?: string;
}

export default function AdaptiveContainer(props: Props) {
  const classes =
    "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 " +
    props.additionalStyles;

  return <div className={classes}>{props.content}</div>;
}
