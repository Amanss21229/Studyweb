import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eraser, Pen, Trash2, Download, Send } from "lucide-react";

interface DrawingCanvasProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitDrawing?: (imageData: string) => void;
}

export function DrawingCanvas({ open, onOpenChange, onSubmitDrawing }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#EF4444" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Orange", value: "#F97316" },
  ];

  useEffect(() => {
    if (open) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Set white background
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, [open]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = isEraser ? "#FFFFFF" : currentColor;
      ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const submitDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL("image/png");
    if (onSubmitDrawing) {
      onSubmitDrawing(imageData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Drawing Canvas</DialogTitle>
          <DialogDescription>
            Draw diagrams, chemical structures, or mathematical concepts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 p-4 bg-muted rounded-lg">
            {/* Color Palette */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium mr-2">Color:</span>
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setCurrentColor(color.value);
                    setIsEraser(false);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    currentColor === color.value && !isEraser
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  data-testid={`color-${color.name.toLowerCase()}`}
                />
              ))}
            </div>

            {/* Tools */}
            <div className="flex items-center gap-2">
              <Button
                variant={!isEraser ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEraser(false)}
                data-testid="button-pen"
              >
                <Pen className="h-4 w-4 mr-2" />
                Pen
              </Button>
              <Button
                variant={isEraser ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEraser(true)}
                data-testid="button-eraser"
              >
                <Eraser className="h-4 w-4 mr-2" />
                Eraser
              </Button>
            </div>

            {/* Brush Size */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24"
                data-testid="brush-size-slider"
              />
              <span className="text-sm text-muted-foreground w-8">{brushSize}px</span>
            </div>
          </div>

          {/* Canvas */}
          <div className="border-2 border-dashed border-border rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              data-testid="drawing-canvas"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="destructive"
              onClick={clearCanvas}
              data-testid="button-clear-canvas"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Canvas
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadDrawing}
                data-testid="button-download"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={submitDrawing}
                data-testid="button-submit-drawing"
              >
                <Send className="h-4 w-4 mr-2" />
                Add to Question
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
