import { Link } from "react-router";
import Logo from "./Logo";
import { facebookLink, instagramLink, linkedinLink, xLink } from "@/lib/constants";
import Facebook from "./icons/facebook";
import Instagram from "./icons/instagram";
import Twitter from "./icons/twitter";
import LinkedIn from "./icons/linkedIn";

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
        <div className="flex gap-2 items-center">
          <Link to={facebookLink} target="_blank">
            <Facebook size={12} />
          </Link>
          <Link to={instagramLink} target="_blank">
            <Instagram size={12} />
          </Link>
          <Link to={xLink} target="_blank">
            <Twitter size={12} />
          </Link>
          <Link to={linkedinLink} target="_blank">
            <LinkedIn size={12} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
