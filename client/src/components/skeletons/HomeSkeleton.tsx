const HomeSkeleton = () => {
  return (
    <div className="flex w-full h-screen flex-col gap-4 items-center justify-center">
      <div className="skeleton h-2/3 w-1/2 "></div>
      <div className="skeleton h-4 w-1/2"></div>
      <div className="skeleton h-4 w-1/2"></div>
      <div className="skeleton h-4 w-1/2"></div>
    </div>
  );
};

export default HomeSkeleton;
