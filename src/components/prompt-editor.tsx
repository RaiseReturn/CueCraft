'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { generatePromptAction } from '@/lib/actions';
import { structurePrompt } from '@/ai/flows/structure-prompt-flow';
import type { StructurePromptOutput } from '@/ai/flows/structure-prompt-flow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const EditorSkeleton = () => (
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
);


export default function PromptEditor({ initialPrompt, initialModel }: { initialPrompt: string, initialModel: string }) {
    const { user, refreshUser } = useUser();
    const { toast } = useToast();

    const [loadingStructure, setLoadingStructure] = useState(true);
    const [structure, setStructure] = useState<StructurePromptOutput | null>(null);
    const [formState, setFormState] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [finalPrompt, setFinalPrompt] = useState<string | null>(null);

    useEffect(() => {
        const getStructure = async () => {
            try {
                setLoadingStructure(true);
                const result = await structurePrompt({ simplePrompt: initialPrompt, model: initialModel });
                setStructure(result);
                // Initialize form state
                const initialFormState: Record<string, string> = {};
                result.promptElements.forEach(el => {
                    initialFormState[el.label] = Array.isArray(el.value) ? el.value[0] : el.value;
                });
                result.technicalParams.forEach(el => {
                    initialFormState[el.label] = Array.isArray(el.value) ? el.value[0] : el.value;
                });
                initialFormState['target-model'] = initialModel;
                setFormState(initialFormState);
            } catch (e: any) {
                toast({ title: "Error Analyzing Prompt", description: e.message || 'Could not analyze prompt.', variant: 'destructive' });
            } finally {
                setLoadingStructure(false);
            }
        };
        getStructure();
    }, [initialPrompt, initialModel, toast]);

    const handleFormChange = (key: string, value: string) => {
        setFormState(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsGenerating(true);
        setFinalPrompt(null);
    
        const formData = new FormData();
        formData.set('prompt', JSON.stringify(formState));
        formData.set('model', formState['target-model'] || initialModel);
    
        const result = await generatePromptAction(user?.id ?? 'guest', {}, formData);
        
        if (result.error) {
            toast({ title: 'Error Generating Prompt', description: result.error, variant: 'destructive' });
        } else if (result.data) {
            setFinalPrompt(result.data.generatedPrompt);
            if (user?.id !== 'guest') refreshUser();
            toast({ title: 'Success!', description: 'Final prompt generated.'});
        }
    
        setIsGenerating(false);
    };

    if (loadingStructure) {
        return <EditorSkeleton />;
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">Prompt Engineer</h1>
                <p className="text-muted-foreground">Refine the details to craft the perfect prompt.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Original Idea</CardTitle>
                        <CardDescription>This was your starting point. You can edit it here if you like.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea defaultValue={initialPrompt} rows={2} className="text-base" onChange={(e) => handleFormChange('original-prompt', e.target.value)}/>
                    </CardContent>
                </Card>

                <Accordion type="multiple" defaultValue={['elements', 'params']} className="w-full space-y-4">
                    {structure?.promptElements && structure.promptElements.length > 0 && (
                        <Card><AccordionItem value="elements" className="border-none">
                            <AccordionTrigger className="p-6 text-lg font-medium">Core Elements</AccordionTrigger>
                            <AccordionContent className="p-6 pt-0 grid gap-4">
                                {structure.promptElements.map(el => (
                                    <div key={el.label} className="grid gap-1.5">
                                        <label className="text-sm font-medium">{el.label}</label>
                                        {el.description && <p className="text-sm text-muted-foreground">{el.description}</p>}
                                        {el.type === 'select' && Array.isArray(el.value) ? (
                                            <Select name={el.label} value={formState[el.label]} onValueChange={(v) => handleFormChange(el.label, v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>{el.value.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                                            </Select>
                                        ) : el.type === 'textarea' ? (
                                            <Textarea name={el.label} value={formState[el.label] || ''} onChange={(e) => handleFormChange(el.label, e.target.value)} />
                                        ) : (
                                            <Input name={el.label} value={formState[el.label] || ''} onChange={(e) => handleFormChange(el.label, e.target.value)} />
                                        )}
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem></Card>
                    )}

                    {structure?.technicalParams && (
                        <Card><AccordionItem value="params" className="border-none">
                            <AccordionTrigger className="p-6 text-lg font-medium">Technical Parameters</AccordionTrigger>
                            <AccordionContent className="p-6 pt-0 grid gap-4">
                               <div className="grid gap-1.5">
                                     <label className="text-sm font-medium">Target Model</label>
                                     <Select name="target-model" value={formState['target-model']} onValueChange={(v) => handleFormChange('target-model', v)}>
                                         <SelectTrigger><SelectValue /></SelectTrigger>
                                         <SelectContent>
                                            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                            <SelectItem value="sora">Sora</SelectItem>
                                            <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                                            <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                                            <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                                            <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                                            <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                                            <SelectItem value="llama-3">Llama 3</SelectItem>
                                            <SelectItem value="midjourney">Midjourney</SelectItem>
                                            <SelectItem value="grok">Grok</SelectItem>
                                         </SelectContent>
                                     </Select>
                                 </div>

                                {structure.technicalParams.map(el => (
                                     <div key={el.label} className="grid gap-1.5">
                                         <label className="text-sm font-medium">{el.label}</label>
                                         {el.description && <p className="text-sm text-muted-foreground">{el.description}</p>}
                                        {el.type === 'select' && Array.isArray(el.value) ? (
                                            <Select name={el.label} value={formState[el.label]} onValueChange={(v) => handleFormChange(el.label, v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>{el.value.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                                            </Select>
                                        ) : (
                                            <Input name={el.label} value={formState[el.label] || ''} onChange={(e) => handleFormChange(el.label, e.target.value)} />
                                        )}
                                     </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem></Card>
                    )}
                </Accordion>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isGenerating} className="w-full sm:w-auto">
                        {isGenerating ? 'Generating...' : <><Wand2 className="mr-2 h-4 w-4" /> Generate Final Prompt</>}
                    </Button>
                </div>
            </form>

            {finalPrompt && (
                 <Card className="mt-6 animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="w-6 h-6 text-primary"/> Your Generated Prompt</CardTitle>
                        <CardDescription>You can now copy and paste this into your target AI model.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 border rounded-md bg-muted/20 font-code text-sm whitespace-pre-wrap">
                            {finalPrompt}
                        </div>
                    </CardContent>
                 </Card>
            )}
        </div>
    );
}
