import { Link } from "react-router";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex flex-col-reverse md:flex-row items-center justify-center gap-6 border-t text-sm text-muted-foreground p-4 text-center md:text-start">
      <p className="flex items-center gap-2">
        <Logo size={24} className="font-semibold" />
        <span className="text-xs">© {currentYear} All rights reserved</span>
      </p>
      <div className="flex flex-col md:flex-row items-center gap-2 text-xs">
        <Link className="hover:text-primary" to="/">Home</Link>
        <Link className="hover:text-primary" to="/blogs">Blogs</Link>
        <Link className="hover:text-primary" to="/faqs">FAQS</Link>
        <Link className="hover:text-primary" to="/privacy-policy">Privacy Policy</Link>
        <Link className="hover:text-primary" to="/terms-of-service">Terms of Service</Link>
      </div>
    </footer>
  );
};

export default Footer;
