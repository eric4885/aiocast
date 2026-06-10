"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SavePdfButton() {
  return (
    <Button
      variant="primary"
      type="button"
      onClick={() => window.print()}
      title="Opens your browser print dialog — choose Save as PDF or a printer"
    >
      <FileDown className="mr-2 h-4 w-4" />
      Print / Save as PDF
    </Button>
  );
}
