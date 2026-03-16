"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How to use UIGen</DialogTitle>
          <DialogDescription>
            Generate React components with AI — no setup required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <section>
            <h3 className="font-semibold mb-1">Getting started</h3>
            <p className="text-muted-foreground">
              Describe the component you want in plain English. For example:
              &ldquo;A card with a title, description, and a call-to-action
              button&rdquo; or &ldquo;A responsive navigation bar with a logo
              and links.&rdquo;
            </p>
          </section>
          <section>
            <h3 className="font-semibold mb-1">Iterating</h3>
            <p className="text-muted-foreground">
              After the initial generation, keep chatting to refine your
              component. Ask for color changes, layout adjustments, new
              features, or anything else — each message builds on the previous
              result.
            </p>
          </section>
          <section>
            <h3 className="font-semibold mb-1">Preview &amp; Code tabs</h3>
            <p className="text-muted-foreground">
              The right panel shows a live preview of your component. Switch to
              the Code tab to inspect the generated source, browse files in the
              file tree, and copy snippets directly.
            </p>
          </section>
          <section>
            <h3 className="font-semibold mb-1">Saving your work</h3>
            <p className="text-muted-foreground">
              Sign in to persist your projects across sessions. Authenticated
              users can create multiple designs and switch between them using
              the project picker in the header.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
