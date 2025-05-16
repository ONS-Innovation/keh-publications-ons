import { ChartConfig } from "@/components/ui/chart"

/**
 * Creates a chart configuration object from data for use with ChartContainer
 * 
 * @param data Array of chart data points containing name and value
 * @returns Chart configuration with labels for each data point
 */
export function createChartConfig(data: Array<{ name: string; value: number }>): ChartConfig {
  const config: ChartConfig = {
    value: { label: "Count" }
  }
  
  data.forEach(item => {
    config[item.name] = {
      label: item.name,
    }
  })
  
  return config
} 