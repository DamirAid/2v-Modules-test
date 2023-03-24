import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    className,
    onClick,
    children,
    type = "button",
    ...otherProps
  } = props;



  return (
    <button type={type} className={className} {...otherProps}>
      {children}
    </button>
  );
};
