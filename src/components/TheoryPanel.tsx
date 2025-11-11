// src/components/TheoryPanel.tsx
import type { ReactNode } from "react";
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type TheorySection = {
  heading: string;
  body: ReactNode;
};

type TheoryModel = {
  title: string;
  sections: TheorySection[];
};

type TheoryPanelProps =
  | { title: string; sections: TheorySection[]; theory?: never }
  | { theory: TheoryModel; title?: never; sections?: never };

function TheoryPanelBase(props: TheoryPanelProps) {
  const title = "theory" in props ? props.theory.title : props.title;
  const sections = ("theory" in props ? props.theory.sections : props.sections) ?? [];

  return (
    <Card className="bg-gradient-card border-border/40 mt-6">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">No content available.</p>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {sections.map((s, i) => {
              const key = s.heading || `section-${i}`;
              return (
                <AccordionItem key={key} value={key} className="border-border/30">
                  <AccordionTrigger className="text-left">{s.heading}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-6 text-muted-foreground">
                    {s.body}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

const TheoryPanel = memo(TheoryPanelBase);
export default TheoryPanel;
