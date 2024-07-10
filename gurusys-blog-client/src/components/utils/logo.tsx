import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="w-[70px] sm:w-[85px] inline-block">
      <img
        src="/logo.svg"
        alt="logo by logoipsum"
        className="inline-flex w-full h-auto"
      />
    </Link>
  );
};
