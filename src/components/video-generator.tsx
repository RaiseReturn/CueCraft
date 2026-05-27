'use client';
import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Video } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { generateVideoAction } from '@/lib/actions';
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

export default function VideoGenerator() {
  const { user, refreshUser } = useUser();
  const { toast } = useToast();

  const [videoState, videoAction] = useActionState(
    (prevState, formData) => generateVideoAction(user?.id ?? 'guest', prevState, formData),
    { data: null, error: null }
  );

  useEffect(() => {
    if (videoState?.error) toast({ title: 'Error', description: videoState.error, variant: 'destructive' });
    if (videoState?.data) refreshUser();
  }, [videoState, refreshUser, toast]);

  const videoPlaceholder = PlaceHolderImages.find(p => p.id === 'generated_video_1')!;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Video className="w-8 h-8 text-primary" />
            <CardTitle className="font-headline text-3xl">Video Generation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form action={videoAction} className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input name="prompt" placeholder="Describe the video you want to create..." required />
            <SubmitButton>Generate Video</SubmitButton>
          </div>
        </form>
         <div className="mt-6 flex justify-center">
            {videoState?.data ? (
                <video src={videoState.data} controls className="rounded-lg border shadow-md w-full max-w-[512px] aspect-video" />
            ) : (
                <Image
                    src={videoPlaceholder.imageUrl}
                    alt={videoPlaceholder.description}
                    width={512}
                    height={288}
                    className="rounded-lg border shadow-md"
                    data-ai-hint={videoPlaceholder.imageHint}
                />
            )}
        </div>
      </CardContent>
    </Card>
  );
}
