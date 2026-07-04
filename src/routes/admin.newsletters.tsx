// @ts-nocheck — DB types generated; some referenced tables/columns pending migrations.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useNewsletters, nextFridayISO } from "@/lib/newsletters";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeError } from "@/lib/error-sanitize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  id: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  excerpt: z.string().optional(),
  body: z.string().min(1, "Body is required"),
  scheduled_for: z.string().optional(),
  cover_image: z.string().optional(),
  links: z.string().optional(),
  published: z.boolean(),
});

export const Route = createFileRoute("/admin/newsletters")({
  component: AdminNewslettersPage,
});

function AdminNewslettersPage() {
  const { data: newsletters } = useNewsletters();
  const [editing, setEditing] = useState<string | null>(null);
  const qc = useQueryClient();

  const deleteN = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("newsletters").delete().eq("id", id);
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["newsletters"] }),
  });

  const upsert = useMutation({
    mutationFn: async (n: z.infer<typeof schema>) => {
      const payload = {
        subject: n.subject,
        excerpt: n.excerpt || null,
        body: n.body,
        scheduled_for: n.scheduled_for || null,
        cover_image: n.cover_image || null,
        links: JSON.parse(n.links || "[]"),
        published: n.published,
      };
      if (n.id) {
        const { error } = await supabase.from("newsletters").update(payload).eq("id", n.id);
        if (error) throw new Error(sanitizeError(error));
      } else {
        const { error } = await supabase.from("newsletters").insert(payload);
        if (error) throw new Error(sanitizeError(error));
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["newsletters"] });
      setEditing(null);
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: "",
      excerpt: "",
      body: "",
      scheduled_for: nextFridayISO(),
      cover_image: "",
      links: "",
      published: true,
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <section className="py-16 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <Link to="/admin" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
              <ArrowLeft className="h-3 w-3" /> Back to admin
            </Link>
            <h1 className="font-display font-black text-4xl">Newsletters</h1>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {editing === "new" && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(upsert.mutate)} className="bg-card border border-border/60 p-6 space-y-4">
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="excerpt" render={({ field }) => (
                    <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="body" render={({ field }) => (
                    <FormItem><FormLabel>Body</FormLabel><FormControl><Textarea {...field} rows={8} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="scheduled_for" render={({ field }) => (
                    <FormItem><FormLabel>Scheduled for</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                  )} />
                  <div className="flex gap-3">
                    <Button type="submit">Save</Button>
                    <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                  </div>
                </form>
              </Form>
            )}
            <div className="space-y-3">
              {(newsletters ?? []).map((n: Record<string, unknown>) => (
                <div key={n.id as string} className="border border-border/60 bg-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary">{(n.subject as string) ?? "Untitled"}</p>
                    <p className="text-xs text-silver/60">{(n.scheduled_for as string) ? new Date(n.scheduled_for as string).toLocaleString() : "Draft"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setEditing(n.id as string)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteN.mutate(n.id as string)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <Button className="w-full" onClick={() => { setEditing("new"); form.reset(); }}>+ New Newsletter</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
