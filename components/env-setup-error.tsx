"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EnvSetupErrorProps {
  error: string;
  onRetry?: () => void;
}

export function EnvSetupError({ error, onRetry }: EnvSetupErrorProps) {
  const [copied, setCopied] = useState(false);

  const envTemplate = `# PostgreSQL Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=your_database_name
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(envTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <AlertTriangle className="w-5 h-5" />
          Database Configuration Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-amber-700">
          <p className="mb-2">
            <strong>Error:</strong> {error}
          </p>
          <p className="mb-4">
            To get started, you need to set up your database environment
            variables.
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-amber-800">
            Follow these steps:
          </div>

          <ol className="list-decimal list-inside space-y-2 text-sm text-amber-700">
            <li>
              Create a{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">
                .env
              </code>{" "}
              file in your project root
            </li>
            <li>Add your PostgreSQL connection details (see template below)</li>
            <li>Restart your development server</li>
            <li>Refresh this page</li>
          </ol>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-amber-800 flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Environment Variables Template:
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 text-xs"
            >
              <Copy className="w-3 h-3 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          <pre className="bg-amber-100 p-3 rounded-md text-xs text-amber-900 overflow-x-auto">
            {envTemplate}
          </pre>
        </div>

        <div className="text-xs text-amber-600 bg-amber-100 p-2 rounded">
          <strong>Note:</strong> Make sure to replace the placeholder values
          with your actual PostgreSQL database credentials.
        </div>

        {onRetry && (
          <div className="pt-2">
            <Button onClick={onRetry} className="w-full">
              Test Connection Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
