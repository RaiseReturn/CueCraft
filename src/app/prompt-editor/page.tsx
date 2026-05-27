import PromptEditor from '@/components/prompt-editor';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

function EditorSkeleton() {
    return (
        <div className="space-y-6">
            <header>
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-5 w-1/2 mt-2" />
            </header>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full space-y-4">
                <Card><AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="p-6"><Skeleton className="h-6 w-1/4" /></AccordionTrigger>
                    <AccordionContent className="p-6 pt-0 space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </AccordionContent>
                </AccordionItem></Card>
                <Card><AccordionItem value="item-2" className="border-none">
                    <AccordionTrigger className="p-6"><Skeleton className="h-6 w-1/4" /></AccordionTrigger>
                    <AccordionContent className="p-6 pt-0 space-y-4">
                        <Skeleton className="h-10 w-full" />
                    </AccordionContent>
                </AccordionItem></Card>
            </Accordion>
            <div className="flex justify-end">
                <Skeleton className="h-10 w-48" />
            </div>
        </div>
    )
}

export default function PromptEditorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const prompt = (searchParams?.prompt as string) || '';
  const model = (searchParams?.model as string) || 'gpt-4o';

  if (!prompt) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold">No prompt provided.</h1>
            <p className="mt-2">Please go back to the homepage and enter a prompt to start.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<EditorSkeleton />}>
            <PromptEditor initialPrompt={prompt} initialModel={model} />
        </Suspense>
    </div>
  );
}
