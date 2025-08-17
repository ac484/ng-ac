"use client";

import { Cpu, File, Loader2, UploadCloud } from "lucide-react";
import { useActionState, useEffect, useRef, useTransition } from "react";

import { processDocument } from "@/app/dashboard/documents/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentItemsTable } from "@/features/documents/components/work-items-table";
import { useToast } from "@/hooks/use-toast";


const initialState = {
  data: undefined,
  error: undefined,
  fileName: undefined,
};

export default function DocumentsPage() {
  const [state, formAction] = useActionState(processDocument, initialState);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Extraction Failed",
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        startTransition(() => {
          formAction(formData);
        });
      }
    }
  };

  const handleUploadClick = () => {
    // Reset file input to allow re-uploading the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    fileInputRef.current?.click();
  };


  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground font-headline">Document Processor</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Automatically extract data from your contracts, quotes, and estimates.
          </p>
        </header>

        <Card className="w-full shadow-2xl bg-card">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>Select a file to begin extraction.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef}>
              <div
                className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary transition-colors"
                onClick={handleUploadClick}
                onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
                role="button"
                tabIndex={0}
                aria-label="Upload document"
              >
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX, etc.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isPending}
                  accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </div>
            </form>
          </CardContent>
        </Card>

        {isPending && (
          <div className="flex flex-col items-center justify-center mt-8 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium text-foreground">Processing document, please wait...</p>
            <p className="text-muted-foreground">This may take a few moments.</p>
          </div>
        )}

        {state.data && !isPending && (
          <div className="mt-8">
            <Card className="shadow-2xl bg-card">
              <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">Extracted Work Items</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-2">
                        <File className="w-4 h-4" />
                        {state.fileName}
                        </CardDescription>
                    </div>
                    {state.data.totalTokens > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-2">
                          <Cpu className="w-4 h-4" />
                          <span>{state.data.totalTokens.toLocaleString()} tokens</span>
                      </Badge>
                    )}
                  </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="doc-id">編號</Label>
                      <Input id="doc-id" placeholder="Document ID" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doc-name">名稱</Label>
                      <Input id="doc-name" placeholder="Document Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-name">客戶</Label>
                      <Input id="client-name" placeholder="Client Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-rep">客戶代表</Label>
                      <Input id="client-rep" placeholder="Client Representative" />
                    </div>
                </div>
                <DocumentItemsTable initialData={state.data.workItems} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
