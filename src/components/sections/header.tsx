import { Github, Linkedin, Mail, Youtube, Facebook, Instagram, Video } from "lucide-react";
import { MovingElement } from "../navbar";

// Custom X (Twitter) icon
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Header({ data }: { data: Record<string, string> }) {
  const handleChange = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <section className="pt-12">
      <div className="space-y-2">
        <p className="font-normal text-muted-foreground text-base">
          hi there👋, I&apos;m
        </p>

        <div>
          <h1 className="font-bold text-primary/90 text-4xl tracking-tight">
            {data.NAME}
          </h1>
          <h2 className="flex flex-col gap-0 font-normal text-primary/90 text-base">
            <p>
              {data.AGE}, {data.PRONOUN}
            </p>
            <p>{data.HEADLINE}</p>
          </h2>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {/* Primary CTA - X/Twitter */}
          <button
            onClick={() => handleChange(data.X)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-medium text-sm transition-all hover:scale-105"
          >
            <XIcon />
            <span>Follow my journey</span>
          </button>
          
          {/* Other social links */}
          <div className="flex gap-2">
            <MovingElement
              change={() => handleChange(data.EMAIL)}
              ariaLabel="Email"
            >
              <Mail />
            </MovingElement>
            <MovingElement
              change={() => handleChange(data.GITHUB)}
              ariaLabel="Github"
            >
              <Github />
            </MovingElement>
            <MovingElement
              change={() => handleChange(data.LINKEDIN)}
              ariaLabel="Linkedin"
            >
              <Linkedin />
            </MovingElement>
            <MovingElement
              change={() => handleChange(data.YOUTUBE)}
              ariaLabel="YouTube"
            >
              <Youtube />
            </MovingElement>
            <MovingElement
              change={() => handleChange(data.FACEBOOK)}
              ariaLabel="Facebook"
            >
              <Facebook />
            </MovingElement>
            <MovingElement
              change={() => handleChange(data.INSTAGRAM)}
              ariaLabel="Instagram"
            >
              <Instagram />
            </MovingElement>
            <MovingElement
              change={() => handleChange(data.TIKTOK)}
              ariaLabel="TikTok"
            >
              <Video />
            </MovingElement>
          </div>
        </div>
      </div>
    </section>
  );
}
