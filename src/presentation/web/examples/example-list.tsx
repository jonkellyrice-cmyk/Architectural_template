import type { Example } from "@/src/domain/examples";

export function ExampleList({ examples }: { readonly examples: readonly Example[] }) {
  if (examples.length === 0) return <p>No examples are currently stored.</p>;
  return (
    <ul>
      {examples.map((example) => (
        <li key={example.id}>{example.name} <small><time dateTime={example.createdAt}>{example.createdAt}</time></small></li>
      ))}
    </ul>
  );
}
