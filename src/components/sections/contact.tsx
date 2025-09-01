import { Github, Linkedin, Mail, Youtube, Facebook, Instagram, Video } from "lucide-react";
import Link from "next/link";

export function Contact({ data }: { data: Record<string, string> }) {
  const handleChange = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <section className="py-10">
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <h2 className="font-bold text-3xl">Hãy cùng hợp tác nhé!</h2>
          <p className="mx-auto max-w-2xl text-gray-300 text-base">
            Tôi luôn quan tâm đến các cơ hội mới và những dự án thú vị. 
            Dù bạn có một dự án trong đầu hay chỉ muốn trò chuyện về công nghệ, 
            tôi rất mong được nghe từ bạn.
          </p>
        </div>

        <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
          <button
            className="inline-flex justify-center items-center bg-primary betterhover:hover:bg-primary/90 disabled:opacity-50 shadow px-4 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 font-medium text-primary-foreground text-sm whitespace-nowrap transition-colors cursor-target disabled:pointer-events-none"
            onClick={() => handleChange(data.EMAIL)}
          >
            <Mail className="mr-2 w-4 h-4" />
            Liên hệ với tôi
          </button>
        </div>

        <div className="flex justify-center items-center gap-6 pt-2">
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => handleChange(data.EMAIL)}
          >
            <Mail className="w-5 h-5" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => handleChange(data.GITHUB)}
          >
            <Github className="w-5 h-5" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => handleChange(data.LINKEDIN)}
          >
            <Linkedin className="w-5 h-5" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => handleChange(data.YOUTUBE)}
          >
            <Youtube className="w-5 h-5" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => handleChange(data.FACEBOOK)}
          >
            <Facebook className="w-5 h-5" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => handleChange(data.INSTAGRAM)}
          >
            <Instagram className="w-5 h-5" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => handleChange(data.TIKTOK)}
          >
            <Video className="w-5 h-5" />
          </Link>
        </div>

        <div className="pt-4 cursor-target">
          <p className="text-gray-400 text-sm">
            Hiện tại tôi sẵn sàng nhận các dự án freelance và cơ hội học tập
          </p>
          <p className="mt-2 text-gray-500 text-xs">
            Thời gian phản hồi: Thường trong vòng 24 giờ
          </p>
        </div>
      </div>
    </section>
  );
}
