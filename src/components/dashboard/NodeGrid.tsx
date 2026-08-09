import { NodeCard } from "@/components/dashboard/NodeCard";
import type { NodeData } from "@/types/dashboard";

/**
 * Node monitoring card grid (SPEC §7, §32.9).
 *
 * Four equal-width cards in a single row on desktop, 2-column on medium,
 * single column on small. No section heading — cards follow directly after
 * the Environmental Overview per the approved reference layout.
 */
export function NodeGrid({ nodes }: { nodes: NodeData[] }) {
  return (
    <section
      aria-label="Node status"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
    >
      {nodes.map((node) => (
        <NodeCard key={node.id} node={node} />
      ))}
    </section>
  );
}
