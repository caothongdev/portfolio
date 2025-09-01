import { Github, Linkedin, Mail, Youtube, Facebook, Instagram, Video } from "lucide-react";
import { MovingElement } from "../navbar";

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

        <div className="flex items-center gap-2 text-sm">
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
