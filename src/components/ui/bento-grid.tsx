import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto auto-rows-[minmax(140px,auto)]", // Reduced base height for flexibility
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoItem = ({
  className,
  children,
  colSpan = 1,
  rowSpan = 1,
}: {
  className?: string;
  children?: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3 | 4;
}) => {
  return (
    <div
      className={cn(
        "rounded-3xl group/bento transition duration-200 overflow-hidden relative fade-in-up", // Added fade-in animation
        // Column Spans
        colSpan === 1 && "md:col-span-1",
        colSpan === 2 && "md:col-span-2",
        colSpan === 3 && "md:col-span-3",
        colSpan === 4 && "md:col-span-4",
        // Row Spans
        rowSpan === 1 && "md:row-span-1",
        rowSpan === 2 && "md:row-span-2",
        rowSpan === 3 && "md:row-span-3",
        className
      )}
    >
      {children}
    </div>
  );
};
