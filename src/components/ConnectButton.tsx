import { LINKS } from "../config/links";
import { UI } from "../data/content";
import { connect } from "../lib/events";
import { ArrowRight } from "./Icons";

export default function ConnectButton({ label = UI.connect, variant = "primary" }: { label?: string; variant?: "primary" | "ghost" }) {
  const cls = `btn btn--${variant}`;
  const inner = (
    <>
      <span className="btn__label">{label}</span>
      <ArrowRight />
    </>
  );
  if (LINKS.contact) {
    const external = !/^(mailto|tel):/.test(LINKS.contact);
    return (
      <a className={cls} href={LINKS.contact} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <a
      className={cls}
      href="#connect"
      onClick={(e) => {
        e.preventDefault();
        connect();
      }}
    >
      {inner}
    </a>
  );
}
