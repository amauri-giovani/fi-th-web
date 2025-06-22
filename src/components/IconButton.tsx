import type { ComponentProps } from "react";
import React from "react";


type IconButtonProps = {
  onClick: () => void;
  title?: string;
  icon: (props: ComponentProps<"svg">) => React.ReactNode;
};

export default function IconButton({ onClick, title, icon: Icon }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="bg-blue-900 hover:bg-blue-800 text-white rounded h-8 w-8 flex items-center justify-center"
      type="button"
    >
      <Icon className="w-4 h-4" strokeWidth={3} />
    </button>

  );
}
