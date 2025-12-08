import { Bot, Globe, Video, Rocket, BookOpen } from "lucide-react";

interface SkillCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
}

const SKILL_CARDS: SkillCard[] = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: "Discord Bots",
    description: "Automation tools for communities with payment integration",
    tags: ["Python", "Discord.py", "API"],
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Web Applications",
    description: "Modern, responsive websites with great UX",
    tags: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Content Creation",
    description: "Build in public journey & educational content",
    tags: ["X/Twitter", "YouTube", "Writing"],
  },
];

const LEARNING_NOW = [
  "System Design",
  "IELTS 7.0",
  "Product Thinking",
];

export function Skills({ data }: { data: Record<string, string[]> }) {
  return (
    <div id="skills" className="py-10">
      <h2 className="font-medium text-primary/90 text-base">
        what I build.
      </h2>

      {/* Main Skills Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        {SKILL_CARDS.map((card) => (
          <div
            key={card.title}
            className="cursor-target group p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-all hover:bg-primary/5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-primary/70 group-hover:text-primary transition-colors">
                {card.icon}
              </div>
              <h3 className="font-medium text-primary/90">{card.title}</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              {card.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Currently Learning */}
      <div className="mt-6 flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Rocket className="w-4 h-4" />
          <span>Currently learning:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {LEARNING_NOW.map((item) => (
            <span
              key={item}
              className="px-2 py-0.5 text-xs rounded-full border border-dashed border-primary/30 text-primary/60"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
