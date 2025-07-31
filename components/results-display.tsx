"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Clock, Database, BarChart3, Table2, Download } from "lucide-react";
import { QueryResult } from "./dashboard-client";

interface ResultsDisplayProps {
  result: QueryResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState("table");

  const chartData = useMemo(() => {
    if (!result.data || result.data.length === 0) return null;

    const firstRow = result.data[0];
    const keys = Object.keys(firstRow);

    const numericColumns = keys.filter((key) => {
      return result.data.every(
        (row) =>
          row[key] === null ||
          row[key] === undefined ||
          !isNaN(Number(row[key])),
      );
    });

    const textColumns = keys.filter((key) => !numericColumns.includes(key));

    if (numericColumns.length === 0) return null;

    if (textColumns.length > 0 && numericColumns.length > 0) {
      const labelColumn = textColumns[0];
      const valueColumn = numericColumns[0];

      return {
        type: "categorical",
        data: result.data.slice(0, 20).map((row) => ({
          name: String(row[labelColumn] || "Unknown"),
          value: Number(row[valueColumn]) || 0,
        })),
        config: {
          value: {
            label: valueColumn,
            color: "hsl(var(--chart-1))",
          },
        },
      };
    }

    if (numericColumns.length >= 2) {
      return {
        type: "numeric",
        data: result.data.slice(0, 20).map((row, index) => ({
          index,
          ...numericColumns.reduce(
            (acc, col) => ({
              ...acc,
              [col]: Number(row[col]) || 0,
            }),
            {},
          ),
        })),
        config: numericColumns.reduce(
          (acc, col, index) => ({
            ...acc,
            [col]: {
              label: col,
              color: `hsl(var(--chart-${(index % 5) + 1}))`,
            },
          }),
          {},
        ),
      };
    }

    return null;
  }, [result.data]);

  const downloadCSV = () => {
    if (!result.data || result.data.length === 0) return;

    const headers = Object.keys(result.data[0]);
    const csvContent = [
      headers.join(","),
      ...result.data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (value === null || value === undefined) return "";
            return typeof value === "string" && value.includes(",")
              ? `"${value.replace(/"/g, '""')}"`
              : String(value);
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query-results-${new Date().toISOString().slice(0, 19)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Query Results
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {result.executionTime}ms
              </Badge>
              <Badge variant="outline">
                {result.rowCount} {result.rowCount === 1 ? "row" : "rows"}
              </Badge>
              <Button variant="outline" size="sm" onClick={downloadCSV}>
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
            {result.query}
          </div>
        </CardHeader>

        <CardContent>
          {result.data && result.data.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="table">
                  <Table2 className="w-4 h-4 mr-1" />
                  Table
                </TabsTrigger>
                {chartData && (
                  <TabsTrigger value="chart">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Chart
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="table" className="mt-4">
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {result.fields.map((field) => (
                            <TableHead
                              key={field.name}
                              className="whitespace-nowrap"
                            >
                              {field.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.data.slice(0, 100).map((row, index) => (
                          <TableRow key={index}>
                            {result.fields.map((field) => (
                              <TableCell
                                key={field.name}
                                className="max-w-xs truncate"
                              >
                                {row[field.name] === null ||
                                row[field.name] === undefined ? (
                                  <span className="text-muted-foreground italic">
                                    null
                                  </span>
                                ) : (
                                  String(row[field.name])
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {result.data.length > 100 && (
                    <div className="p-4 text-center text-sm text-muted-foreground border-t">
                      Showing first 100 rows of {result.data.length} total rows
                    </div>
                  )}
                </div>
              </TabsContent>

              {chartData && (
                <TabsContent value="chart" className="mt-4">
                  <div className="w-full overflow-hidden">
                    <div className="h-[400px] w-full">
                      <ChartContainer
                        config={chartData.config}
                        className="h-full w-full"
                      >
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                          minWidth={0}
                        >
                          {chartData.type === "categorical" ? (
                            <BarChart
                              data={chartData.data}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 80,
                              }}
                            >
                              <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                              />
                              <YAxis tick={{ fontSize: 12 }} width={60} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar
                                dataKey="value"
                                fill="var(--color-value)"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          ) : (
                            <LineChart
                              data={chartData.data}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                              }}
                            >
                              <XAxis dataKey="index" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} width={60} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              {Object.keys(chartData.config).map((key) => (
                                <Line
                                  key={key}
                                  type="monotone"
                                  dataKey={key}
                                  stroke={`var(--color-${key})`}
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                />
                              ))}
                            </LineChart>
                          )}
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No data returned from query
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
