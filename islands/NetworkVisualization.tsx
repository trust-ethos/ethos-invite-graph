import { useEffect, useRef, useState } from "preact/hooks";
import { NetworkGraphData } from "../types/ethos.ts";

interface NetworkVisualizationProps {
  profileId: number;
  isFullScreen?: boolean;
  selectedDepth: number;
  onDataUpdate?: (data: NetworkGraphData | null) => void;
}

export default function NetworkVisualization(
  { profileId, isFullScreen = false, selectedDepth, onDataUpdate }:
    NetworkVisualizationProps,
) {
  const [networkData, setNetworkData] = useState<NetworkGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        setLoading(true);
        console.log(
          "Fetching network data for profile:",
          profileId,
          "depth:",
          selectedDepth,
        );

        const response = await fetch(
          `/api/network/${profileId}?depth=${selectedDepth}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch network data");
          setLoading(false);
          return;
        }

        const networkData: NetworkGraphData = await response.json();
        setNetworkData(networkData);
        onDataUpdate?.(networkData);
        console.log("Network data loaded:", networkData.totalNodes, "nodes");
      } catch (err) {
        console.error("Network fetch error:", err);
        setError("Failed to load network data");
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkData();
  }, [profileId, selectedDepth]);

  useEffect(() => {
    if (!networkData || !svgRef.current) return;

    const createVisualization = async () => {
      try {
        // Import D3 dynamically
        const d3 = await import("d3");

        // Clear previous visualization
        d3.select(svgRef.current).selectAll("*").remove();

        const width = isFullScreen ? globalThis.innerWidth : 800;
        const height = isFullScreen ? globalThis.innerHeight : 400;

        const svg = d3.select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height]);

        // Container for zoomable content
        const container = svg.append("g");

        // Create zoom behavior
        const zoom = d3.zoom()
          .scaleExtent([0.1, 4])
          .on("zoom", (event: any) => {
            container.attr("transform", event.transform);
          });

        svg.call(zoom as any);

        // Set initial zoom to be zoomed out by ~15%
        const initialScale = 0.85;
        const initialTransform = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(initialScale)
          .translate(-width / 2, -height / 2);

        svg.call(zoom.transform as any, initialTransform);

        // Prepare data for D3
        const nodes = networkData.nodes.map((node) => ({
          id: node.id,
          profileId: node.profileId,
          username: node.username || node.displayName ||
            `Profile ${node.profileId}`,
          level: node.level,
          score: node.score || 0,
          avatarUrl: node.avatarUrl,
        }));

        // Create a set of valid node IDs to filter edges
        const nodeIds = new Set(nodes.map((n) => n.id));

        // Only include edges where both source and target nodes exist
        const links = networkData.edges
          .filter((edge) =>
            nodeIds.has(edge.source) && nodeIds.has(edge.target)
          )
          .map((edge) => ({
            source: edge.source,
            target: edge.target,
          }));

        console.log(
          `Filtered to ${links.length} valid links from ${networkData.edges.length} total edges`,
        );

        // Create force simulation
        const simulation = d3.forceSimulation(nodes as any)
          .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
          .force("charge", d3.forceManyBody().strength(-300))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("collision", d3.forceCollide().radius(25));

        // Color function based on credibility score (using exact retro theme colors)
        const getScoreColor = (score: number): string => {
          if (score < 800) return "#FF1493"; // retro-pink (untrusted)
          if (score < 1200) return "#FFD700"; // retro-yellow (questionable)
          if (score < 1600) return "#666666"; // gray-700 (neutral)
          if (score < 2000) return "#00FFFF"; // retro-cyan (reputable)
          if (score < 2400) return "#39FF14"; // retro-lime (exemplary)
          return "#8A2BE2"; // retro-purple (revered)
        };

        // Size function based on credibility score with dramatic differences
        const getScoreSize = (score: number): number => {
          console.log("Node score:", score); // Debug log

          // Much more extreme size differences
          if (score < 800) return 5; // Tiny for untrusted
          if (score < 1200) return 8; // Small for questionable
          if (score < 1600) return 15; // Medium for neutral
          if (score < 2000) return 25; // Large for reputable
          if (score < 2400) return 35; // Very large for exemplary
          return 45; // Massive for revered
        };

        // Create links
        const link = container.selectAll(".link")
          .data(links)
          .enter().append("line")
          .attr("class", "link")
          .attr("stroke", "#8A2BE2")
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 0.6);

        // Create node groups
        const nodeGroup = container.selectAll(".node")
          .data(nodes)
          .enter().append("g")
          .attr("class", "node")
          .style("cursor", "pointer")
          .call(
            d3.drag()
              .on("start", (event: any, d: any) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
              })
              .on("drag", (event: any, d: any) => {
                d.fx = event.x;
                d.fy = event.y;
              })
              .on("end", (event: any, d: any) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
              }) as any,
          );

        // Add colored ring (outer circle) for score indication
        nodeGroup.append("circle")
          .attr("r", (d: any) => getScoreSize(d.score || 0) + 3) // Ring is slightly larger
          .attr("fill", "none")
          .attr("stroke", (d: any) => getScoreColor(d.score || 0))
          .attr("stroke-width", 4);

        // Add white background circle for images
        nodeGroup.append("circle")
          .attr("r", (d: any) => getScoreSize(d.score || 0))
          .attr("fill", "#fff")
          .attr("stroke", "#ddd")
          .attr("stroke-width", 1);

        // Add profile images using foreignObject for better image handling
        const imageSize = (d: any) => getScoreSize(d.score || 0) * 2; // diameter
        
        nodeGroup.append("foreignObject")
          .attr("width", (d: any) => imageSize(d))
          .attr("height", (d: any) => imageSize(d))
          .attr("x", (d: any) => -imageSize(d) / 2)
          .attr("y", (d: any) => -imageSize(d) / 2)
          .append("xhtml:div")
          .style("width", "100%")
          .style("height", "100%")
          .style("border-radius", "50%")
          .style("overflow", "hidden")
          .style("display", "flex")
          .style("align-items", "center")
          .style("justify-content", "center")
          .style("background", "#f0f0f0")
          .html((d: any) => {
            if (d.avatarUrl) {
              return `<img src="${d.avatarUrl}" 
                        style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" 
                        crossorigin="anonymous"
                        loading="lazy"
                        onerror="this.style.display='none'; this.nextSibling.style.display='flex';" />
                      <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: ${Math.max(12, imageSize(d) * 0.2)}px; font-weight: bold; color: #666; background: ${getScoreColor(d.score || 0)}; border-radius: 50%;">
                        ${d.score || '0'}
                      </div>`;
            } else {
              // Fallback for no avatar - show score with colored background
              return `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: ${Math.max(12, imageSize(d) * 0.25)}px; font-weight: bold; color: #fff; background: ${getScoreColor(d.score || 0)}; border-radius: 50%;">
                        ${d.score || '0'}
                      </div>`;
            }
          });

        // Add labels
        nodeGroup.append("text")
          .text((d: any) => d.username)
          .attr("dy", -25)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .attr("fill", "#333")
          .attr("pointer-events", "none");

        // Add click handlers
        nodeGroup.on("click", (_event: any, d: any) => {
          console.log("Clicked node:", d);
          globalThis.location.href = `/analysis/${d.profileId}`;
        });

        // Add hover effects
        nodeGroup
          .on("mouseover", function (_event: any, _d: any) {
            d3.select(this as any).select("circle")
              .transition().duration(200)
              .attr("r", (d: any) => getScoreSize(d.score || 0) * 1.3)
              .attr("stroke-width", 3);
          })
          .on("mouseout", function (_event: any, _d: any) {
            d3.select(this as any).select("circle")
              .transition().duration(200)
              .attr("r", (d: any) => getScoreSize(d.score || 0))
              .attr("stroke-width", 2);
          });

        // Update positions on simulation tick
        simulation.on("tick", () => {
          link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

          nodeGroup
            .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });

        console.log(
          "D3 visualization created with:",
          nodes.length,
          "nodes",
          links.length,
          "links",
        );
      } catch (error) {
        console.error("Error creating D3 visualization:", error);
        setError("Failed to create visualization");
      }
    };

    createVisualization();
  }, [networkData]);

  if (loading) {
    return isFullScreen
      ? (
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-retro-teal/20 to-retro-purple/20">
          <div class="text-center">
            <div class="w-24 h-24 border-8 border-retro-teal border-t-retro-purple rounded-full animate-spin mx-auto mb-6">
            </div>
            <div class="text-retro-purple font-retro font-black text-2xl">
              BUILDING NETWORK...
            </div>
          </div>
        </div>
      )
      : (
        <div class="bg-white/90 backdrop-blur-sm border-4 border-retro-purple rounded-3xl p-8 shadow-retro-lg">
          <h3 class="text-2xl font-retro text-retro-purple mb-6 font-black">
            NETWORK VISUALIZATION
          </h3>
          <div class="flex items-center justify-center py-16">
            <div class="w-16 h-16 border-4 border-retro-teal border-t-retro-purple rounded-full animate-spin">
            </div>
            <div class="ml-4 text-retro-purple font-retro font-black text-lg">
              BUILDING NETWORK...
            </div>
          </div>
        </div>
      );
  }

  if (error) {
    return isFullScreen
      ? (
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-retro-magenta/20 to-retro-purple/20">
          <div class="text-center">
            <div class="text-6xl mb-6">😅</div>
            <div class="text-retro-purple font-retro font-black text-2xl mb-4">
              OOPS!
            </div>
            <div class="text-gray-700 font-bold text-lg">{error}</div>
          </div>
        </div>
      )
      : (
        <div class="bg-white/90 backdrop-blur-sm border-4 border-retro-magenta rounded-3xl p-8 shadow-retro-lg">
          <h3 class="text-2xl font-retro text-retro-purple mb-6 font-black">
            NETWORK VISUALIZATION
          </h3>
          <div class="text-center py-8">
            <div class="text-4xl mb-4">😅</div>
            <div class="text-retro-purple font-retro font-black text-lg mb-2">
              OOPS!
            </div>
            <div class="text-gray-700 font-bold">{error}</div>
          </div>
        </div>
      );
  }

  if (isFullScreen) {
    return (
      <>
        {/* Full-screen SVG */}
        <svg
          ref={svgRef}
          class="w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, #F5F5DC 0%, #E6E6FA 50%, #F0F8FF 100%)",
          }}
        />

        {/* Floating Legend */}
        <div class="fixed bottom-6 left-6 z-[100]">
          <div
            class="bg-white border-4 border-retro-teal rounded-2xl p-4 shadow-retro-lg"
            style="pointer-events: auto; position: relative; z-index: 1000;"
          >
            <div class="text-sm font-bold text-gray-700 mb-3 font-retro">
              CREDIBILITY LEGEND:
            </div>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-retro-pink"></div>
                <span class="text-xs font-bold">&lt;800 Untrusted</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-retro-yellow"></div>
                <span class="text-xs font-bold">800-1199 Questionable</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-gray-700"></div>
                <span class="text-xs font-bold">1200-1599 Neutral</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-retro-cyan"></div>
                <span class="text-xs font-bold">1600-1999 Reputable</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-retro-lime"></div>
                <span class="text-xs font-bold">2000-2399 Exemplary</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-retro-purple"></div>
                <span class="text-xs font-bold">2400+ Revered</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div class="bg-white/90 backdrop-blur-sm border-4 border-retro-purple rounded-3xl p-8 shadow-retro-lg">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-retro text-retro-purple font-black">
          NETWORK VISUALIZATION
        </h3>
        <div class="text-sm font-bold text-gray-700">
          {networkData?.totalNodes} nodes, {networkData?.edges.length}{" "}
          connections
        </div>
      </div>

      {/* Legend */}
      <div class="mb-4 p-4 bg-retro-teal/10 border-2 border-retro-teal rounded-xl">
        <div class="text-sm font-bold text-gray-700 mb-2">
          Credibility Legend:
        </div>
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 rounded-full bg-retro-pink"></div>
            <span class="text-xs font-bold">&lt;800 Untrusted</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 rounded-full bg-retro-yellow"></div>
            <span class="text-xs font-bold">800-1199 Questionable</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 rounded-full bg-gray-700"></div>
            <span class="text-xs font-bold">1200-1599 Neutral</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 rounded-full bg-retro-cyan"></div>
            <span class="text-xs font-bold">1600-1999 Reputable</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 rounded-full bg-retro-lime"></div>
            <span class="text-xs font-bold">2000-2399 Exemplary</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 rounded-full bg-retro-purple"></div>
            <span class="text-xs font-bold">2400+ Revered</span>
          </div>
          <div class="text-xs font-bold text-gray-600">
            Size = Score • Drag nodes • Click to explore • Scroll to zoom
          </div>
        </div>
      </div>

      {/* D3 Visualization Container */}
      <div class="w-full border-2 border-retro-cyan rounded-xl bg-cream overflow-hidden">
        <svg
          ref={svgRef}
          class="w-full h-96"
          style={{ minHeight: "400px", background: "#F5F5DC" }}
        />
      </div>
    </div>
  );
}
