import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Complexity = {
  best: string;
  average: string;
  worst: string;
  space: string;
  stable?: boolean;
  inPlace?: boolean;
};

type Theory = {
  title: string;
  tagline?: string;
  intro: string;
  steps: string[];
  pseudocode: string;
  complexity: Complexity;
  notes?: string[];
};

export default function TheorySection({
  theory,
}: {
  theory: Theory;
}) {
  const { title, tagline, intro, steps, pseudocode, complexity, notes } = theory;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {title}
          {tagline && <Badge variant="secondary">{tagline}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-invert max-w-none">
        <p className="text-muted-foreground">{intro}</p>

        <h3>How it works (intuition)</h3>
        <ol className="list-decimal pl-6 space-y-1">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>

        <h3>Pseudocode</h3>
        <pre className="overflow-x-auto rounded-md border border-border bg-background p-4 text-sm leading-6">
{pseudocode}
        </pre>

        <h3>Complexity</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-border px-3 py-2 text-left">Best</th>
                <th className="border-b border-border px-3 py-2 text-left">Average</th>
                <th className="border-b border-border px-3 py-2 text-left">Worst</th>
                <th className="border-b border-border px-3 py-2 text-left">Space</th>
                <th className="border-b border-border px-3 py-2 text-left">Stable</th>
                <th className="border-b border-border px-3 py-2 text-left">In-place</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-border px-3 py-2">{complexity.best}</td>
                <td className="border-b border-border px-3 py-2">{complexity.average}</td>
                <td className="border-b border-border px-3 py-2">{complexity.worst}</td>
                <td className="border-b border-border px-3 py-2">{complexity.space}</td>
                <td className="border-b border-border px-3 py-2">{complexity.stable ? "Yes" : "No"}</td>
                <td className="border-b border-border px-3 py-2">{complexity.inPlace ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {notes && notes.length > 0 && (
          <>
            <h3>Notes</h3>
            <ul className="list-disc pl-6 space-y-1">
              {notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export type { Theory, Complexity };
