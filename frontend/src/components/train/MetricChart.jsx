import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * MetricChart Component
 *
 * One live line chart (loss OR accuracy) against epoch.
 *
 * SWE Design Patterns applied:
 * 1. One Measure per Chart: loss and accuracy have different scales, so they
 *    get two charts instead of one chart with two y-axes (which invites
 *    misreading where the lines cross).
 * 2. Live-Data Friendly: Recharts' entry animation is disabled — with new
 *    points every 200 ms it would restart constantly and jitter.
 * 3. Theme via currentColor: axis/grid colours inherit `currentColor` from
 *    Tailwind text classes on the wrapper, so the chart follows dark mode
 *    without any JS theme lookups.
 */
export default function MetricChart({
  data,
  dataKey,
  title,
  seriesName = title,
  totalEpochs,
  yDomain = [0, "auto"],
  format = (v) => v.toFixed(3),
  stroke = "#0891b2",
  emptyText = "Start training to see this chart.",
}) {
  return (
    <figure className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
      <figcaption className="flex items-baseline justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {data.length > 0 && (
          <span className="text-sm font-mono font-bold text-slate-900 dark:text-white tabular-nums">
            {format(data.at(-1)[dataKey])}
          </span>
        )}
      </figcaption>
      <div className="h-44 text-slate-400 dark:text-slate-500">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
            {emptyText}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="currentColor" strokeOpacity={0.25} vertical={false} />
              <XAxis
                dataKey="epoch"
                type="number"
                domain={[0, totalEpochs]}
                tick={{ fontSize: 10, fill: "currentColor" }}
                tickLine={false}
                axisLine={{ stroke: "currentColor", strokeOpacity: 0.5 }}
              />
              <YAxis
                domain={yDomain}
                tickFormatter={format}
                tick={{ fontSize: 10, fill: "currentColor" }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip
                cursor={{ stroke: "currentColor", strokeOpacity: 0.6 }}
                formatter={(v) => [format(v), seriesName]}
                labelFormatter={(epoch) => `Epoch ${epoch}`}
                contentStyle={{ borderRadius: 12, fontSize: 12 }}
                // Text uses text colours, never the series colour
                labelStyle={{ color: "#64748b" }}
                itemStyle={{ color: "#0f172a", fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={stroke}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </figure>
  );
}
