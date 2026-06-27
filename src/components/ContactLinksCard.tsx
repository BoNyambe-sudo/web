import { Phone } from "lucide-react";
import Whatsapp from "./icons/whatsapp";
import { Card } from "./ui/card";
import { Link } from "react-router";
import { useOutsideClick } from "@/hooks/clickAway";
import { useToggleState } from "@/hooks/clientState/useToggles";
import { Separator } from "./ui/separator";

const ContactLinksCard = () => {
  const isContactOpen = useToggleState((state => state.isContactOpen))
  const setIsContactOpen = useToggleState(state => state.toggleContactOpen)
  const contactCardRef = useOutsideClick<HTMLDivElement>(() =>
      setIsContactOpen(false),
    );
  return (
    <Card
      className={`absolute left-0 bottom-0 ${isContactOpen ? "flex" : "hidden"} flex-col gap-2 p-2`}
      ref={contactCardRef}
    >
      <div className="flex items-center gap-2">
        <Whatsapp aria-label="WhatsApp" />
        <Link to="https://wa.me/+260978000956" target="_blank" rel="noopener noreferrer">WhatsApp</Link>
      </div>
      <Separator />
      <div className="flex items-center gap-2">
        <Phone size={"16"} aria-label="Phone" />
        <Link to="tel:+260978000956">
          Call
        </Link>
      </div>
    </Card>
  );
};

export default ContactLinksCard;
