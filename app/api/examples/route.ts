import { runtime } from "@/src/composition";

export async function GET() {
  return runtime.http.examples.list();
}

export async function POST(request: Request) {
  return runtime.http.examples.create(request);
}
