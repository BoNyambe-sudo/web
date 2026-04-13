import Logo from "./Logo";

const AdminFooter = () => {
  return (
    <div className="flex items-center justify-center text-muted-foreground text-sm py-4">
      <div className="flex items-center gap-2">
        <Logo size={24} />
        <span className="text-xs">
          &copy; {new Date().getFullYear()} All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default AdminFooter;
