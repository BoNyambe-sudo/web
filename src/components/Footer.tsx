import { Link } from "react-router";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex items-center gap-6 border-t text-sm text-muted-foreground p-4">
      <p className="flex items-center gap-2">
        <Logo size={24} className="font-semibold" />
        <span className="text-xs">© {currentYear}</span>
      </p>
      <div className="flex items-center gap-2 text-xs">
        <Link className="hover:text-primary" to="/">Home</Link>
        <Link className="hover:text-primary" to="/blogs">Blogs</Link>
        <Link className="hover:text-primary" to="/faqs">FAQS</Link>
      </div>
    </footer>
  );
};

export default Footer;
