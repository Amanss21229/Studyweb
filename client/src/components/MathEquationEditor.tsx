import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MathEquationEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitEquation?: (equation: string) => void;
}

export function MathEquationEditor({ open, onOpenChange, onSubmitEquation }: MathEquationEditorProps) {
  const [equation, setEquation] = useState("");
  const { toast } = useToast();

  const mathSymbols = [
    { symbol: "∫", name: "Integral", latex: "\\int" },
    { symbol: "∑", name: "Sigma", latex: "\\sum" },
    { symbol: "√", name: "Square Root", latex: "\\sqrt{}" },
    { symbol: "∂", name: "Partial", latex: "\\partial" },
    { symbol: "∞", name: "Infinity", latex: "\\infty" },
    { symbol: "π", name: "Pi", latex: "\\pi" },
    { symbol: "θ", name: "Theta", latex: "\\theta" },
    { symbol: "α", name: "Alpha", latex: "\\alpha" },
    { symbol: "β", name: "Beta", latex: "\\beta" },
    { symbol: "γ", name: "Gamma", latex: "\\gamma" },
    { symbol: "Δ", name: "Delta", latex: "\\Delta" },
    { symbol: "≤", name: "Less than or equal", latex: "\\leq" },
    { symbol: "≥", name: "Greater than or equal", latex: "\\geq" },
    { symbol: "≠", name: "Not equal", latex: "\\neq" },
    { symbol: "±", name: "Plus minus", latex: "\\pm" },
    { symbol: "×", name: "Multiply", latex: "\\times" },
    { symbol: "÷", name: "Divide", latex: "\\div" },
    { symbol: "≈", name: "Approximately", latex: "\\approx" },
  ];

  const fractions = [
    { name: "Fraction", latex: "\\frac{numerator}{denominator}" },
    { name: "Power", latex: "x^{power}" },
    { name: "Subscript", latex: "x_{subscript}" },
    { name: "Limit", latex: "\\lim_{x \\to 0}" },
  ];

  const insertSymbol = (symbol: string) => {
    setEquation(equation + symbol);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(equation);
    toast({
      title: "Copied!",
      description: "Equation copied to clipboard",
    });
  };

  const submitEquation = () => {
    if (onSubmitEquation && equation.trim()) {
      onSubmitEquation(equation);
      onOpenChange(false);
      setEquation("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Mathematical Equation Editor</DialogTitle>
          <DialogDescription>
            Create mathematical equations using LaTeX notation or insert symbols
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="symbols" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="symbols">Math Symbols</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="symbols" className="space-y-4">
            <div className="grid grid-cols-6 gap-2">
              {mathSymbols.map((item) => (
                <Button
                  key={item.symbol}
                  variant="outline"
                  className="h-12 text-lg font-semibold"
                  onClick={() => insertSymbol(item.latex)}
                  title={item.name}
                  data-testid={`symbol-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.symbol}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {fractions.map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-start"
                  onClick={() => insertSymbol(item.latex)}
                  data-testid={`template-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="font-medium">{item.name}</span>
                  <code className="text-xs text-muted-foreground mt-1">{item.latex}</code>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <label className="text-sm font-medium">LaTeX Equation:</label>
          <Textarea
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="Enter LaTeX equation (e.g., \int_{0}^{\infty} x^2 dx)"
            className="font-mono text-sm"
            rows={4}
            data-testid="equation-input"
          />
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Preview (text format):</p>
          <p className="font-mono text-sm" data-testid="equation-preview">
            {equation || "Your equation will appear here..."}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            💡 Tip: Use backslash (\) before special commands
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={copyToClipboard}
              disabled={!equation.trim()}
              data-testid="button-copy-equation"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              onClick={submitEquation}
              disabled={!equation.trim()}
              data-testid="button-submit-equation"
            >
              <Send className="h-4 w-4 mr-2" />
              Add to Question
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
