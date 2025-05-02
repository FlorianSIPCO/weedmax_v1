"use client";

const SpinnerButtons = () => {
  return (
    <div className="flex justify-center items-center">
      <span className="relative w-7 h-7 inline-block rounded-full border-t-2 border-pink-400 border-r-2 border-r-transparent animate-spin-slow">
        <span className="absolute inset-0 rounded-full border-l-2 border-[#ed4254] border-b-2 border-b-transparent animate-spin-fast"></span>
      </span>
    </div>
  );
};

export default SpinnerButtons;
