import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RoofMeasurements } from "@/app/actions/analyze-roof";

interface CostEstimationProps {
  measurements?: RoofMeasurements;
  isLoading?: boolean;
}

export function CostEstimation({
  measurements,
  isLoading,
}: CostEstimationProps) {
  const [pricePerSquare, setPricePerSquare] = useState(425); // Default middle value
  const [totalSquares, setTotalSquares] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (measurements?.area) {
      // Convert to squares (1 square = 100 sq ft)
      const squares = measurements.area / 100;
      setTotalSquares(squares);
      setTotalCost(squares * pricePerSquare);
    }
  }, [measurements?.area, pricePerSquare]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cost Estimation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Price per Square</span>
                <span className="text-sm font-medium">${pricePerSquare}</span>
              </div>
              <Slider
                value={[pricePerSquare]}
                onValueChange={(value) => setPricePerSquare(value[0])}
                min={350}
                max={5000}
                step={5}
                className="w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>$350</span>
                <span>$5000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Roof Size</div>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : `${totalSquares.toFixed(1)} Squares`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {measurements?.area.toLocaleString()} sq ft
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Estimated Cost</div>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : `$${totalCost.toLocaleString()}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on selected price
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
