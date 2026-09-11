import { runtime } from "@/src/composition";
import { ExampleList } from "@/src/presentation/web/examples";

export default async function HomePage() {
  const examples = await runtime.application.listExamples();

  return (
    <main>
      <h1>{runtime.config.appName}</h1>
      <p>This page is intentionally thin: it asks the composed application for data and passes that data to presentation.</p>
      <ExampleList examples={examples} />
      <p>Create an item with <code>POST /api/examples</code> and JSON <code>{'{ "name": "Example name" }'}</code>.</p>
    </main>
  );
}
