'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

export default function Studio() {
  const { user } = useUser();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-4o');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const params = new URLSearchParams({ prompt, model });
    router.push(`/prompt-editor?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)]">
        <div className="flex-1 flex flex-col justify-center items-start">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline flex items-center gap-2">
                <Sparkles className="w-10 h-10 text-primary" />
                <span>Hi, {user?.name || 'Guest'}</span>
            </h1>
            <h2 className="text-4xl sm:text-5xl font-bold text-muted-foreground/80 mt-2">Let's build a masterpiece.</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
                Start with a simple idea, and we'll help you craft the perfect, detailed prompt for any AI model.
            </p>
        </div>

      <div className="py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex flex-col w-full p-3 pr-4 border-none bg-muted/30 rounded-2xl shadow-sm min-h-[56px] justify-center">
            <div className="flex items-start gap-4">
                <Textarea
                  name="prompt"
                  placeholder="e.g., A funny video of a crow teaching people not to spit..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  className="bg-transparent border-none focus-visible:ring-0 resize-none w-full p-0 shadow-none text-base min-h-[24px]"
                  rows={1}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          const form = e.target as HTMLTextAreaElement;
                          form.form?.requestSubmit();
                      }
                  }}
                />
                <Button type="submit" size="icon" variant="ghost" disabled={!prompt.trim()} className="rounded-full bg-primary/80 hover:bg-primary text-primary-foreground shrink-0 w-8 h-8">
                  <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-auto bg-transparent border-none h-auto p-1 focus:ring-0 gap-2">
                    <Bot className="w-4 h-4"/>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>OpenAI</SelectLabel>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="sora">Sora</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Google</SelectLabel>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Anthropic</SelectLabel>
                    <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Meta</SelectLabel>
                    <SelectItem value="llama-3">Llama 3</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Other</SelectLabel>
                    <SelectItem value="midjourney">Midjourney</SelectItem>
                    <SelectItem value="grok">Grok</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
