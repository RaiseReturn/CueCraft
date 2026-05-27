'use client';
import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ImageIcon } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { generateImageAction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Generating...' : children}
    </Button>
  );
}

export default function ImageGenerator() {
  const { user, refreshUser } = useUser();
  const { toast } = useToast();

  const [imageState, imageAction] = useActionState(
    (prevState, formData) => generateImageAction(user?.id ?? 'guest', prevState, formData),
    { data: null, error: null }
  );

  useEffect(() => {
    if (imageState?.error) toast({ title: 'Error', description: imageState.error, variant: 'destructive' });
    if (imageState?.data) refreshUser();
  }, [imageState, refreshUser, toast]);

  const imagePlaceholder = PlaceHolderImages.find(p => p.id === 'generated_image_1')!;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-primary" />
            <CardTitle className="font-headline text-3xl">Image Generation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form action={imageAction} className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input name="prompt" placeholder="Describe the image you want to create..." required />
             <SubmitButton>Generate Image</SubmitButton>
          </div>
        </form>
        <div className="mt-6 flex justify-center">
            <Image
              src={imageState?.data || imagePlaceholder.imageUrl}
              alt={imageState?.data ? "Generated Image" : imagePlaceholder.description}
              width={512}
              height={512}
              className="rounded-lg border shadow-md"
              data-ai-hint={imagePlaceholder.imageHint}
            />
        </div>
      </CardContent>
    </Card>
  );
}
