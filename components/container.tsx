import clsx from "clsx";

const SectionContainer: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx("container mx-auto px-6 sm:px-24", className)}>
      {children}
    </div>
  );
};
export default SectionContainer;
