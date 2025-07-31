"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Play, History, LogOut } from "lucide-react";
import { QueryDialog } from "@/components/query-dialog";
import { ResultsDisplay } from "@/components/results-display";
import { QueryHistory } from "@/components/query-history";
import { ResultsSkeleton } from "@/components/results-skeleton";
import { EnvSetupError } from "@/components/env-setup-error";
import { ModeToggle } from "@/components/mode-toggle";
import { signOut } from "@/lib/auth-client";

export interface QueryResult {
  id: string;
  query: string;
  data: any[];
  fields: any[];
  rowCount: number;
  executionTime: number;
  timestamp: Date;
  connectionName?: string;
}

export function DashboardClient() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([]);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("sql-dashboard-history");

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setQueryHistory(
          parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })),
        );
      } catch (e) {
        console.error("Failed to parse saved history");
      }
    }

    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch("/api/db/connect");
      if (response.ok) {
        setIsConnected(true);
        setConnectionError(null);
      } else {
        const errorData = await response.json();
        setIsConnected(false);
        setConnectionError(
          errorData.details || errorData.error || "Database connection failed",
        );
      }
    } catch (error) {
      console.error("Failed to check database connection:", error);
      setIsConnected(false);
      setConnectionError(
        "Failed to connect to database. Please check your configuration.",
      );
    }
  };

  const handleQueryStart = () => {
    setIsLoadingResults(true);
    setCurrentResult(null);
  };

  const handleQueryResult = (result: QueryResult) => {
    setCurrentResult(result);
    setIsLoadingResults(false);
    const updatedHistory = [result, ...queryHistory.slice(0, 49)];
    setQueryHistory(updatedHistory);
    localStorage.setItem(
      "sql-dashboard-history",
      JSON.stringify(updatedHistory),
    );
    setShowQueryDialog(false);
  };

  const handleQueryError = () => {
    setIsLoadingResults(false);
  };

  const handleHistorySelect = (result: QueryResult) => {
    setCurrentResult(result);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setQueryHistory([]);
    localStorage.removeItem("sql-dashboard-history");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">psqueelie</h1>
            <p className="text-muted-foreground">
              Execute SQL queries and visualize your PostgreSQL data
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => setShowQueryDialog(true)}
            disabled={!isConnected}
          >
            <Play className="w-4 h-4 mr-2" />
            New Query
          </Button>

          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            disabled={queryHistory.length === 0}
          >
            <History className="w-4 h-4 mr-2" />
            History ({queryHistory.length})
          </Button>
        </div>

        {connectionError ? (
          <EnvSetupError
            error={connectionError}
            onRetry={checkDatabaseConnection}
          />
        ) : isLoadingResults ? (
          <ResultsSkeleton />
        ) : currentResult ? (
          <ResultsDisplay result={currentResult} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                Welcome to your SQL Dashboard{" "}
                {isConnected && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600 h-5 ml-1"
                  >
                    <Database className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {!isConnected
                  ? "Checking database connection..."
                  : "Execute a query to see results here."}
              </p>
            </CardContent>
          </Card>
        )}

        <QueryDialog
          open={showQueryDialog}
          onOpenChange={setShowQueryDialog}
          onResult={handleQueryResult}
          onStart={handleQueryStart}
          onError={handleQueryError}
        />

        <QueryHistory
          open={showHistory}
          onOpenChange={setShowHistory}
          history={queryHistory}
          onSelect={handleHistorySelect}
          onClear={clearHistory}
        />
      </div>
    </div>
  );
}
