"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Database, Trash2 } from "lucide-react";
import { QueryResult } from "./dashboard-client";

interface QueryHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: QueryResult[];
  onSelect: (result: QueryResult) => void;
  onClear: () => void;
}

export function QueryHistory({
  open,
  onOpenChange,
  history,
  onSelect,
  onClear,
}: QueryHistoryProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Query History</DialogTitle>
              <DialogDescription>
                Recent queries and their results
              </DialogDescription>
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Database className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No queries in history</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((result, index) => (
                <div key={result.id} className="space-y-2">
                  <div
                    className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onSelect(result)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {result.executionTime}ms
                        </Badge>
                        <Badge variant="outline">
                          {result.rowCount}{" "}
                          {result.rowCount === 1 ? "row" : "rows"}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {result.timestamp.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-sm font-mono bg-muted p-2 rounded text-foreground">
                      {result.query.length > 200
                        ? `${result.query.substring(0, 200)}...`
                        : result.query}
                    </div>
                  </div>

                  {index < history.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
