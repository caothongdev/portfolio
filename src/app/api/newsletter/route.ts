import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = subscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      // If unsubscribed before, reactivate
      if (existing.status === "unsubscribed") {
        await supabase
          .from("newsletter_subscribers")
          .update({ 
            status: "active", 
            unsubscribed_at: null,
            subscribed_at: new Date().toISOString()
          })
          .eq("id", existing.id);

        return NextResponse.json(
          { message: "Welcome back! You've been resubscribed." },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: "You're already subscribed!" },
        { status: 200 }
      );
    }

    // Insert new subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: email.toLowerCase(),
        status: "active",
        source: "website",
      });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    // TODO: Optional - Send welcome email via Resend (free tier)
    // await sendWelcomeEmail(email);

    return NextResponse.json(
      { message: "Successfully subscribed! 🎉" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// GET - Get subscriber count (public stat)
export async function GET() {
  try {
    const { count, error } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (error) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    return NextResponse.json({ count: count || 0 }, { status: 200 });
  } catch {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
